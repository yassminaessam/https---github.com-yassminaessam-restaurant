import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";
import crypto from "crypto";

// Get all recipes
export const getRecipes: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const recipes = await prisma.recipe.findMany({
      include: {
        RecipeLine: {
          include: {
            Item: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// Create new recipe
export const createRecipe: RequestHandler = async (req, res) => {
  try {
    const { outputItemId, lines, ...recipeData } = req.body;
    const prisma = getPrisma();

    const recipe = await prisma.$transaction(async (tx) => {
      const newRecipe = await tx.recipe.create({
        data: {
          ...recipeData,
          RecipeLine: {
            create: lines.map((line: any) => ({
              itemId: line.itemId,
              qty: line.quantity,
              uom: line.uom || recipeData.yieldUom || 'piece'
            }))
          }
        },
        include: {
          RecipeLine: {
            include: {
              Item: true
            }
          }
        }
      });

      return newRecipe;
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// Get all production orders
export const getProductionOrders: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const orders = await prisma.productionOrder.findMany({
      include: {
        Recipe: {
          include: {
            RecipeLine: {
              include: {
                Item: true
              }
            }
          }
        },
        User: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching production orders:", error);
    res.status(500).json({ error: "Failed to fetch production orders" });
  }
};

// Create new production order
export const createProductionOrder: RequestHandler = async (req, res) => {
  try {
    const { recipeId, sourceWarehouseId, destinationWarehouseId, batchSize, ...orderData } = req.body;
    const prisma = getPrisma();

    const order = await prisma.$transaction(async (tx) => {
      // Create production order
      const newOrder = await tx.productionOrder.create({
        data: {
          ...orderData,
          recipeId,
          userId: req.body.userId || 'SYSTEM',
          plannedQty: batchSize,
          status: 'draft'
        },
        include: {
          Recipe: {
            include: {
              RecipeLine: {
                include: {
                  Item: true
                }
              }
            }
          },
          User: true
        }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating production order:", error);
    res.status(500).json({ error: "Failed to create production order" });
  }
};

// Complete production order
export const completeProductionOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();

    const order = await prisma.$transaction(async (tx) => {
      // Get the production order with recipe details
      const productionOrder = await tx.productionOrder.findUnique({
        where: { id },
        include: {
          Recipe: {
            include: {
              RecipeLine: true
            }
          }
        }
      });

      if (!productionOrder) {
        throw new Error("Production order not found");
      }

      // Deduct ingredients from source warehouse
      for (const line of productionOrder.Recipe.RecipeLine) {
        const quantityNeeded = Number(line.qty) * Number(productionOrder.plannedQty);

        // Create stock ledger entry for consumption
        await tx.stockLedger.create({
          data: {
            id: crypto.randomUUID(),
            itemId: line.itemId,
            warehouseId: 'KITCHEN',
            txnType: 'production_consume',
            qty: -quantityNeeded,
            refType: 'production_order',
            refId: id,
            txnDate: new Date(),
            notes: `Production order ${productionOrder.poNumber}`
          }
        });
      }

      // Update production order status
      const updatedOrder = await tx.productionOrder.update({
        where: { id },
        data: {
          status: 'completed',
          actualQty: productionOrder.plannedQty
        },
        include: {
          Recipe: {
            include: {
              RecipeLine: {
                include: {
                  Item: true
                }
              }
            }
          },
          User: true
        }
      });

      return updatedOrder;
    });

    res.json(order);
  } catch (error) {
    console.error("Error completing production order:", error);
    res.status(500).json({ error: "Failed to complete production order" });
  }
};

// Get recipe ingredients (lines)
export const getRecipeIngredients: RequestHandler = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const prisma = getPrisma();
    
    const ingredients = await prisma.recipeLine.findMany({
      where: { recipeId },
      include: {
        Item: {
          select: {
            id: true,
            name: true,
            sku: true,
            baseUom: true
          }
        }
      }
    });
    
    res.json(ingredients);
  } catch (error) {
    console.error("Error fetching recipe ingredients:", error);
    res.status(500).json({ error: "Failed to fetch recipe ingredients" });
  }
};

// Add ingredient to recipe
export const addRecipeIngredient: RequestHandler = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { itemId, quantity, uom } = req.body;
    const prisma = getPrisma();
    
    const ingredient = await prisma.recipeLine.create({
      data: {
        id: crypto.randomUUID(),
        recipeId,
        itemId,
        qty: parseFloat(quantity),
        uom: uom || 'piece'
      },
      include: {
        Item: {
          select: {
            id: true,
            name: true,
            sku: true,
            baseUom: true
          }
        }
      }
    });
    
    res.json(ingredient);
  } catch (error) {
    console.error("Error adding recipe ingredient:", error);
    res.status(500).json({ error: "Failed to add recipe ingredient" });
  }
};

// Update recipe ingredient
export const updateRecipeIngredient: RequestHandler = async (req, res) => {
  try {
    const { ingredientId } = req.params;
    const { quantity, uom } = req.body;
    const prisma = getPrisma();
    
    const ingredient = await prisma.recipeLine.update({
      where: { id: ingredientId },
      data: {
        qty: quantity ? parseFloat(quantity) : undefined,
        uom: uom || undefined
      },
      include: {
        Item: {
          select: {
            id: true,
            name: true,
            sku: true,
            baseUom: true
          }
        }
      }
    });
    
    res.json(ingredient);
  } catch (error) {
    console.error("Error updating recipe ingredient:", error);
    res.status(500).json({ error: "Failed to update recipe ingredient" });
  }
};

// Delete recipe ingredient
export const deleteRecipeIngredient: RequestHandler = async (req, res) => {
  try {
    const { ingredientId } = req.params;
    const prisma = getPrisma();
    
    await prisma.recipeLine.delete({
      where: { id: ingredientId }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe ingredient:", error);
    res.status(500).json({ error: "Failed to delete recipe ingredient" });
  }
};

// Update recipe
export const updateRecipe: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const prisma = getPrisma();
    
    const recipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
      include: {
        RecipeLine: {
          include: {
            Item: true
          }
        }
      }
    });
    
    res.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

// Update production order
export const updateProductionOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const prisma = getPrisma();
    
    const order = await prisma.productionOrder.update({
      where: { id },
      data: updateData,
      include: {
        Recipe: {
          include: {
            RecipeLine: {
              include: {
                Item: true
              }
            }
          }
        },
        User: true
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error("Error updating production order:", error);
    res.status(500).json({ error: "Failed to update production order" });
  }
};

// Start production order
export const startProductionOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();
    
    const order = await prisma.productionOrder.update({
      where: { id },
      data: { 
        status: 'in_progress'
      },
      include: {
        Recipe: {
          include: {
            RecipeLine: {
              include: {
                Item: true
              }
            }
          }
        },
        User: true
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error("Error starting production order:", error);
    res.status(500).json({ error: "Failed to start production order" });
  }
};

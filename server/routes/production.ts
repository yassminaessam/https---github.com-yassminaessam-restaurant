import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Get all recipes
export const getRecipes: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const recipes = await prisma.recipe.findMany({
      include: {
        lines: {
          include: {
            item: true
          }
        },
        outputItem: true
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
          outputItemId,
          lines: {
            create: lines.map((line: any) => ({
              itemId: line.itemId,
              quantity: line.quantity
            }))
          }
        },
        include: {
          lines: {
            include: {
              item: true
            }
          },
          outputItem: true
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
        recipe: {
          include: {
            outputItem: true,
            lines: {
              include: {
                item: true
              }
            }
          }
        },
        sourceWarehouse: true,
        destinationWarehouse: true
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
          sourceWarehouseId,
          destinationWarehouseId,
          batchSize,
          status: 'PENDING'
        },
        include: {
          recipe: {
            include: {
              outputItem: true,
              lines: {
                include: {
                  item: true
                }
              }
            }
          },
          sourceWarehouse: true,
          destinationWarehouse: true
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
          recipe: {
            include: {
              lines: true,
              outputItem: true
            }
          }
        }
      });

      if (!productionOrder) {
        throw new Error("Production order not found");
      }

      // Deduct ingredients from source warehouse
      for (const line of productionOrder.recipe.lines) {
        const quantityNeeded = line.quantity * productionOrder.batchSize;

        // Create stock ledger entry for consumption
        await tx.stockLedger.create({
          data: {
            warehouseId: productionOrder.sourceWarehouseId,
            itemId: line.itemId,
            quantity: -quantityNeeded,
            transactionType: 'PRODUCTION_CONSUME',
            referenceId: id,
            notes: `Production order ${productionOrder.orderNumber}`
          }
        });
      }

      // Add produced items to destination warehouse
      const outputQuantity = productionOrder.recipe.outputQuantity * productionOrder.batchSize;
      await tx.stockLedger.create({
        data: {
          warehouseId: productionOrder.destinationWarehouseId,
          itemId: productionOrder.recipe.outputItemId,
          quantity: outputQuantity,
          transactionType: 'PRODUCTION_OUTPUT',
          referenceId: id,
          notes: `Production order ${productionOrder.orderNumber}`
        }
      });

      // Update production order status
      const updatedOrder = await tx.productionOrder.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        },
        include: {
          recipe: {
            include: {
              outputItem: true,
              lines: {
                include: {
                  item: true
                }
              }
            }
          },
          sourceWarehouse: true,
          destinationWarehouse: true
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
        item: {
          select: {
            id: true,
            name: true,
            sku: true,
            avgCost: true,
            uom: true
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
        recipeId,
        itemId,
        quantity: parseFloat(quantity),
        uom: uom || undefined
      },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            sku: true,
            avgCost: true,
            uom: true
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
        quantity: quantity ? parseFloat(quantity) : undefined,
        uom: uom || undefined
      },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            sku: true,
            avgCost: true,
            uom: true
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
        lines: {
          include: {
            item: true
          }
        },
        outputItem: true
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
        recipe: {
          include: {
            outputItem: true,
            lines: {
              include: {
                item: true
              }
            }
          }
        },
        sourceWarehouse: true,
        destinationWarehouse: true
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
        status: 'in_progress',
        startedAt: new Date()
      },
      include: {
        recipe: {
          include: {
            outputItem: true,
            lines: {
              include: {
                item: true
              }
            }
          }
        },
        sourceWarehouse: true,
        destinationWarehouse: true
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error("Error starting production order:", error);
    res.status(500).json({ error: "Failed to start production order" });
  }
};

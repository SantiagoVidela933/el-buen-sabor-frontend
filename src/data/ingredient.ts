import { Ingredient } from "../models/Products/Ingredient/Ingredient";
import { MeasurementUnit } from "../models/Products/Ingredient/MeasurementUnit";
import { vegetalesCategory, lacteosCategory, carnesCategory, panificadosCategory } from "./ingredientCategory";

// Ingredientes con todos los campos completos
export const tomate = new Ingredient(1, "Tomate", vegetalesCategory, 500, 1000, MeasurementUnit.g, 300);
export const mozzarella = new Ingredient(2, "Mozzarella", lacteosCategory, 300, 600, MeasurementUnit.g, 1000);
export const albahaca = new Ingredient(3, "Albahaca", vegetalesCategory, 50, 200, MeasurementUnit.g, 200);
export const carneVacuna = new Ingredient(4, "Carne vacuna", carnesCategory, 1000, 2000, MeasurementUnit.g, 1500);
export const lechuga = new Ingredient(5, "Lechuga", vegetalesCategory, 200, 500, MeasurementUnit.g, 150);
export const quesoCheddar = new Ingredient(6, "Queso cheddar", lacteosCategory, 200, 400, MeasurementUnit.g, 800);
export const panHamburguesa = new Ingredient(7, "Pan de hamburguesa", panificadosCategory, 20, 50, MeasurementUnit.u, 100);

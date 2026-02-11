import { MetaphorIcon } from "./MetaphorIcon";
import { ElementIcon } from "./ElementIcon";
import { AnimalIcon } from "./AnimalIcon";
import type { Element } from "@/lib/saju/types";

export function renderMetaphorIcon(metaphorId: string, size = 48) {
  return <MetaphorIcon metaphor={metaphorId} size={size} />;
}

export function renderElementIcon(element: Element, size = 24) {
  return <ElementIcon element={element} size={size} />;
}

export function renderAnimalIcon(animalId: string, size = 24) {
  return <AnimalIcon animal={animalId} size={size} />;
}

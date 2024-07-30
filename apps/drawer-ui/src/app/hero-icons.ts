import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroUsers, heroXCircle } from '@ng-icons/heroicons/outline';

export function provideHeroIcons() {
  return provideIcons({
    heroUsers,
    heroXCircle,
    heroTrash,
  });
}

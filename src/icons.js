import { ChevronLeft, ChevronRight, Globe2, Menu, Minus, Monitor, Moon, Plus, Search, ShoppingBag, Sun, X, createIcons } from 'lucide';

const icons = { ChevronLeft, ChevronRight, Globe2, Menu, Minus, Monitor, Moon, Plus, Search, ShoppingBag, Sun, X };

export function renderIcons() {
  createIcons({ icons, attrs: { width: 20, height: 20, 'stroke-width': 1.75, 'aria-hidden': 'true' } });
}

import { ChevronLeft, ChevronRight, Clock, Flower2, Globe2, Mail, MapPin, Menu, Minus, Monitor, Moon, Phone, Plus, Rotate3d, Search, Shirt, ShoppingBag, Sun, X, createIcons } from 'lucide';

const icons = { ChevronLeft, ChevronRight, Clock, Flower2, Globe2, Mail, MapPin, Menu, Minus, Monitor, Moon, Phone, Plus, Rotate3d, Search, Shirt, ShoppingBag, Sun, X };

export function renderIcons() {
  createIcons({ icons, attrs: { width: 20, height: 20, 'stroke-width': 1.75, 'aria-hidden': 'true' } });
}

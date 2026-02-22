"use client";

import { useState, useEffect } from "react";

export type MenuFromApi = { id: string; slug: string; title: string; display_order: number };

export type MenuItemFromApi = {
  id: string;
  menu_id: string;
  name: string;
  price: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  nigiri: string[];
  uramaki: string[];
  maki: string[];
  allergens: string | null;
};

export function useMenus() {
  const [menus, setMenus] = useState<MenuFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menus")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMenus(Array.isArray(data) ? data : []))
      .catch(() => setMenus([]))
      .finally(() => setLoading(false));
  }, []);

  return { menus, loading };
}

export function useMenuItems(slug: string | null) {
  const [items, setItems] = useState<MenuItemFromApi[]>([]);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/menus/${slug}/items`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return { items, loading };
}

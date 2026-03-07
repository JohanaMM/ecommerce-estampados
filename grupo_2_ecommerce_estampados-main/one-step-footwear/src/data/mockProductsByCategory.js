/**
 * 4 productos inventados por categoría para los carruseles de la home.
 * Cada producto tiene: id, name, price, img (URL), brand.
 */

const MOCK_PRODUCTS_BY_CATEGORY = {
  remeras: [
    { id: "mock-r-1", name: "Remera The Rolling Stones", price: 8500, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", brand: "One Step" },
    { id: "mock-r-2", name: "Remera Nirvana Nevermind", price: 8200, img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80", brand: "One Step" },
    { id: "mock-r-3", name: "Remera Queen Bohemian", price: 8900, img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80", brand: "One Step" },
    { id: "mock-r-4", name: "Remera Pink Floyd Dark Side", price: 9100, img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80", brand: "One Step" },
  ],
  buzos: [
    { id: "mock-b-1", name: "Buzo con capucha AC/DC", price: 12500, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80", brand: "One Step" },
    { id: "mock-b-2", name: "Buzo Metallica Black", price: 13200, img: "https://images.unsplash.com/photo-1578768079052-aa76e52d2c2a?w=400&q=80", brand: "One Step" },
    { id: "mock-b-3", name: "Buzo The Beatles", price: 11800, img: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&q=80", brand: "One Step" },
    { id: "mock-b-4", name: "Buzo Led Zeppelin", price: 12900, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80", brand: "One Step" },
  ],
  "pad-mouse": [
    { id: "mock-p-1", name: "Pad Mouse Gamer RGB", price: 4500, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80", brand: "One Step" },
    { id: "mock-p-2", name: "Pad Mouse Minimalista", price: 3800, img: "https://images.unsplash.com/photo-1586349940243-9cfee0e1e1f2?w=400&q=80", brand: "One Step" },
    { id: "mock-p-3", name: "Pad Mouse Estampado Música", price: 4200, img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80", brand: "One Step" },
    { id: "mock-p-4", name: "Pad Mouse XL", price: 5200, img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80", brand: "One Step" },
  ],
  tazas: [
    { id: "mock-t-1", name: "Taza Videojuegos Clásicos", price: 3200, img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80", brand: "One Step" },
    { id: "mock-t-2", name: "Taza Serie Stranger Things", price: 3500, img: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80", brand: "One Step" },
    { id: "mock-t-3", name: "Taza Anime", price: 3400, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", brand: "One Step" },
    { id: "mock-t-4", name: "Taza Bandas Rock", price: 3300, img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80", brand: "One Step" },
  ],
  termos: [
    { id: "mock-term-1", name: "Termo 500ml Estampado", price: 6800, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", brand: "One Step" },
    { id: "mock-term-2", name: "Termo 750ml Música", price: 7200, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80", brand: "One Step" },
    { id: "mock-term-3", name: "Termo 1L Personalizado", price: 8500, img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80", brand: "One Step" },
    { id: "mock-term-4", name: "Termo Acero Equipos", price: 7900, img: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80", brand: "One Step" },
  ],
};

export function getMockProductsByCategory(slug) {
  return MOCK_PRODUCTS_BY_CATEGORY[slug] || [];
}

export default MOCK_PRODUCTS_BY_CATEGORY;

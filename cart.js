// Simple client-side cart stored in localStorage
const Cart = (function(){
  const KEY = 'time_rush_cart_v1';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } }
  function save(items){ localStorage.setItem(KEY, JSON.stringify(items)); }
  function find(items,id){ return items.find(i=>i.id===id); }

  return {
    addItem(id, qty=1){
      const items = load();
      const existing = find(items,id);
      if(existing) existing.qty += qty;
      else items.push({id, qty});
      save(items);
    },
    remove(id){
      let items = load().filter(i=>i.id!==id);
      save(items);
    },
    update(id, qty){
      let items = load();
      const existing = find(items,id);
      if(!existing) return;
      existing.qty = qty;
      items = items.filter(i=>i.qty>0);
      save(items);
    },
    clear(){ save([]); },
    items(){ return load(); },
    count(){ return load().reduce((s,i)=>s+i.qty,0); }
  };
})();

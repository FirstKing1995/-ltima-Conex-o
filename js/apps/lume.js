// App "lume" — placeholder. Será substituído pelo agente responsável.
export default {
  id: 'lume',
  render(ctx) {
    const { el, kit, app } = ctx;
    el.append(kit.appBar({ title: app.title }), kit.empty({ icon: 'hourglass', title: 'Em construção', text: 'Este app ainda está sendo montado.' }));
  },
};

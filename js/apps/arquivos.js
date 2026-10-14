// App "arquivos" — placeholder. Será substituído pelo agente responsável.
export default {
  id: 'arquivos',
  render(ctx) {
    const { el, kit, app } = ctx;
    el.append(kit.appBar({ title: app.title }), kit.empty({ icon: 'hourglass', title: 'Em construção', text: 'Este app ainda está sendo montado.' }));
  },
};

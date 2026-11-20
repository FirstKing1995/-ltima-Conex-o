// Contatos do celular de Iara. Os personagens principais têm avatar (.jpg); os banais usam iniciais.
// A jornalista Bruna Leal só está salva com e-mail (Iara nunca salvou o telefone dela: digitou à mão).
// O chip de trabalho da Duda NÃO está salvo; só aparece nas notas do contato Duda.

const A = (id) => `assets/caso01/avatars/${id}.jpg`;

export default {
  contacts: [
    // ---- dona do celular
    { id: 'iara', name: 'Iara Fontenele', fullName: 'Iara Fontenele', phones: ['5585987412290'], email: 'iara.fontenele@gmail.com', avatar: A('iara'), color: '#d9825b', relation: 'eu', birthday: '1999-07-09' },

    // ---- personagens principais
    { id: 'duda', name: 'Duda 🌻', fullName: 'Maria Eduarda Sampaio Andrade', phones: ['5588997120384'], email: '', avatar: A('duda'), color: '#d9a441', relation: 'melhor amiga', birthday: '05-04', company: 'Colheita Capital', favorite: true,
      notes: 'amiga desde a 4ª série. consultora da Colheita na serra.' },
    { id: 'rafa', name: 'Rafa (bloqueado)', fullName: 'Rafael Aguiar', phones: ['5588998312456'], email: '', avatar: A('rafa'), color: '#7c6cf0', relation: 'ex', blocked: true, notes: 'não responder' },
    { id: 'caio', name: 'Caio Montenegro', fullName: 'Caio Montenegro', phones: ['5585991230077'], email: 'caio@colheitacapital.com.br', avatar: A('caio'), color: '#3f4a5a', relation: 'cliente', company: 'Colheita Capital' },
    { id: 'bruna', name: 'Bruna Leal (O Farol)', fullName: 'Bruna Leal', phones: [], email: 'bruna.leal@ofarol.com.br', avatar: A('bruna'), color: '#2bb3a3', relation: 'jornalista', company: 'O Farol', notes: 'reunião seg 12/10 às 10h, Av. Santos Dumont. falar só por e-mail por enquanto.' },
    { id: 'theo', name: 'Théo 🦉', fullName: 'Théo Castro', phones: ['5585996017733'], email: 'theo.castro@gmail.com', avatar: A('theo'), color: '#2f80ed', relation: 'amigo', favorite: true, birthday: '02-11' },
    { id: 'pai', name: 'Pai ❤️', fullName: 'Antônio Fontenele', phones: ['5588994417710'], email: '', avatar: A('pai'), color: '#9a6b4a', relation: 'pai', favorite: true, birthday: '08-29' },
    { id: 'mae', name: 'Mãe 🤍', fullName: 'Maria do Socorro Fontenele', phones: ['5588994305562'], email: '', avatar: A('mae'), color: '#c2557a', relation: 'mãe', favorite: true, birthday: '09-20', notes: 'contato de emergência' },
    { id: 'lari', name: 'Lari Produção', fullName: 'Larissa Prado', phones: ['5585998764410'], email: 'larissa@prado-eventos.com.br', avatar: A('lari'), color: '#b65fd6', relation: 'trabalho', company: 'Prado Eventos' },
    { id: 'marcos', name: 'Marcos Colheita', fullName: 'Marcos Vieira', phones: ['5585997651122'], email: 'marcos.vieira@colheitacapital.com.br', avatar: A('marcos'), color: '#5f7ad9', relation: 'trabalho', company: 'Colheita Capital' },
    { id: 'igor', name: 'Igor Som', fullName: 'Igor Matos', phones: ['5588996557781'], email: '', avatar: A('igor'), color: '#3d9970', relation: 'trabalho', company: 'Forró Pé de Serra do Rafa' },
    { id: 'nanda', name: 'Nanda', fullName: 'Fernanda Lopes', phones: ['5585999082231'], email: '', avatar: A('nanda'), color: '#e07a5f', relation: 'amiga e colega de apê', favorite: true, birthday: '09-18' },
    { id: 'leo', name: 'Léo 🏛️', fullName: 'Leonardo Fontenele', phones: ['5585988903344'], email: '', avatar: A('leo'), color: '#2bb3a3', relation: 'primo', birthday: '01-30' },
    { id: 'ze', name: 'Seu Zé (caseiro)', fullName: 'José Ribamar', phones: ['5588997001189'], email: '', avatar: A('ze'), color: '#8a7a4a', relation: 'caseiro do Sítio Flor da Serra' },

    // ---- contatos banais
    { id: 'tia-neia', name: 'Tia Néia', fullName: 'Maria Neide Fontenele', phones: ['5588992274530'], email: '', avatar: '', color: '#c2557a', relation: 'tia', birthday: '07-24' },
    { id: 'tia-zuila', name: 'Tia Zuíla', fullName: 'Zuíla Fontenele Lima', phones: ['5588993381907'], email: '', avatar: '', color: '#9a6b4a', relation: 'tia', birthday: '12-08' },
    { id: 'sindico', name: 'Wellington Síndico', fullName: 'Wellington Barros', phones: ['5585996630215'], email: '', avatar: '', color: '#5f7ad9', relation: 'síndico', notes: 'Ed. Benfica Plaza, apt 302' },
    { id: 'dona-fatima', name: 'Dona Fátima 4B', fullName: 'Fátima Rocha', phones: ['5585991174286'], email: '', avatar: '', color: '#d9a441', relation: 'vizinha' },
    { id: 'gas', name: 'Gás Seu Neto', fullName: 'Gás e Água Seu Neto', phones: ['5585984410962'], email: '', avatar: '', color: '#e07a5f', relation: 'entrega', company: 'Gás e Água Seu Neto', notes: 'entrega até 18h. aceita Pix.' },
    { id: 'dentista', name: 'Dr. Hélio Dentista', fullName: 'Hélio Gadelha', phones: ['5585987720136'], email: '', avatar: '', color: '#3d9970', relation: 'saúde', company: 'Clínica Odonto Benfica' },
    { id: 'academia', name: 'Academia Ritmo Fit', fullName: 'Academia Ritmo Fit', phones: ['5585985593071'], email: '', avatar: '', color: '#7c6cf0', relation: 'academia' },
    { id: 'manicure', name: 'Jéssica Manicure', fullName: 'Jéssica Moura', phones: ['5585992640718'], email: '', avatar: '', color: '#c2557a', relation: 'serviço' },
    { id: 'farmacia', name: 'Farmácia do Benfica', fullName: 'Farmácia do Benfica', phones: ['5585986015524'], email: '', avatar: '', color: '#2f80ed', relation: 'entrega' },
    { id: 'grafica', name: 'Gráfica Foto&Cia', fullName: 'Gráfica Foto&Cia', phones: ['5585997308849'], email: '', avatar: '', color: '#b65fd6', relation: 'trabalho', notes: 'impressão de fotos em papel fosco' },
    { id: 'sandro', name: 'Sandro Fotógrafo', fullName: 'Sandro Alencar', phones: ['5585991903426'], email: '', avatar: '', color: '#5f7ad9', relation: 'colega de profissão' },
    { id: 'marina', name: 'Marina Noivas', fullName: 'Marina Teles', phones: ['5585996172803'], email: '', avatar: '', color: '#d9a441', relation: 'cliente', notes: 'casamento em 21/11, Beberibe' },
    { id: 'prof-anselmo', name: 'Prof. Anselmo', fullName: 'Anselmo Carvalho', phones: ['5588998841257'], email: '', avatar: '', color: '#3f4a5a', relation: 'ex-professor', notes: 'Sobral, Comunicação' },
    { id: 'vet', name: 'Dr. Tobias Veterinário', fullName: 'Tobias Nogueira', phones: ['5588993927760'], email: '', avatar: '', color: '#8a7a4a', relation: 'veterinário do Bento' },
    { id: 'lavanderia', name: 'Lavanderia Bolha', fullName: 'Lavanderia Bolha', phones: ['5585984670331'], email: '', avatar: '', color: '#2bb3a3', relation: 'serviço' },
  ],
};

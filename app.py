from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import logging

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clientes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configuração de log
logging.basicConfig(level=logging.DEBUG)

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente = db.Column(db.String(100), nullable=False)
    tel = db.Column(db.String(15), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    sexo = db.Column(db.String(10), default="")
    instagram = db.Column(db.String(100), default="")
    endereco = db.Column(db.String(100), default="")
    cartela_cores = db.Column(db.String(50), default="")
    estilo1 = db.Column(db.String(50), default="")
    estilo2 = db.Column(db.String(50), default="")
    estilo3 = db.Column(db.String(50), default="")
    biotipo = db.Column(db.String(50), default="")
    formato_rosto = db.Column(db.String(50), default="")
    altura = db.Column(db.String(10), default="0")
    peso = db.Column(db.String(10), default="0")
    calcado = db.Column(db.Integer, default=0)
    medida_ombro = db.Column(db.String(10), default="0")
    medida_cintura = db.Column(db.String(10), default="0")
    medida_quadril = db.Column(db.String(10), default="0")
    medida_rosto = db.Column(db.String(10), default="0")
    medida_tronco = db.Column(db.String(10), default="0")
    medida_perna = db.Column(db.String(10), default="0")
    pescoco = db.Column(db.String(10), default="")
    busto = db.Column(db.String(10), default="0")
    ombros = db.Column(db.String(10), default="")
    ombros_tamanho = db.Column(db.String(10), default="")
    peso_visual = db.Column(db.String(50), default="")
    valor = db.Column(db.String(20), default="R$ 0,00")
    servico_valor = db.Column(db.String(50), default="")
    forma_pagamento = db.Column(db.String(50), default="")
    observacoes = db.Column(db.Text, default="")
    academia = db.Column(db.Integer, default=0)
    trabalho_formal = db.Column(db.Integer, default=0)
    trabalho_informal = db.Column(db.Integer, default=0)
    home_office = db.Column(db.Integer, default=0)
    almoco_familia = db.Column(db.Integer, default=0)
    viagem = db.Column(db.Integer, default=0)
    balada = db.Column(db.Integer, default=0)
    sair_jantar = db.Column(db.Integer, default=0)
    eventos_corporativos = db.Column(db.Integer, default=0)
    praia_clube = db.Column(db.Integer, default=0)
    data_atendimento = db.Column(db.String(10), default="")
    data_pagamento = db.Column(db.String(10), default="")

def to_dict(self):
    return {col.name: getattr(self, col.name) for col in self.__table__.columns}

Cliente.to_dict = to_dict

def parse_float(value):
    if not value:
        return 0.0
    try:
        value = value.replace('R$', '').replace('.', '').replace(',', '.').strip()
        return float(value)
    except ValueError:
        return 0.0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    data = request.get_json()
    app.logger.debug('Dados recebidos para cadastro: %s', data)
    new_id = str(Cliente.query.order_by(Cliente.id.desc()).first().id + 1).zfill(4) if Cliente.query.first() else '0001'
    data['id'] = new_id
    try:
        data['altura'] = parse_float(data.get('altura'))
        data['peso'] = parse_float(data.get('peso'))
        data['calcado'] = int(data['calcado']) if data.get('calcado') else 0
        data['medida_ombro'] = parse_float(data.get('medida_ombro'))
        data['medida_cintura'] = parse_float(data.get('medida_cintura'))
        data['medida_quadril'] = parse_float(data.get('medida_quadril'))
        data['medida_rosto'] = parse_float(data.get('medida_rosto'))
        data['medida_tronco'] = parse_float(data.get('medida_tronco'))
        data['medida_perna'] = parse_float(data.get('medida_perna'))
        data['busto'] = parse_float(data.get('busto'))
        data['valor'] = f"R$ {parse_float(data.get('valor')):,.2f}".replace('.', ',')
        data['data_atendimento'] = data.get('data_atendimento', '')
        data['data_pagamento'] = data.get('data_pagamento', '')
        app.logger.debug('Dados formatados para cadastro: %s', data)
    except Exception as e:
        app.logger.error('Erro ao formatar dados: %s', e)
        return jsonify({'result': 'Erro ao cadastrar cliente'}), 400

    novo_cliente = Cliente(**data)
    db.session.add(novo_cliente)
    db.session.commit()
    return jsonify({'result': f'Cliente cadastrado com sucesso! ID: {new_id}'})

@app.route('/pesquisar', methods=['GET'])
def pesquisar():
    query = request.args.get('query')
    app.logger.debug('Consulta recebida: %s', query)
    cliente = Cliente.query.filter((Cliente.id == query) | (Cliente.cliente.ilike(f"%{query}%"))).first()
    if cliente:
        return jsonify(cliente.to_dict())
    return jsonify({'result': 'Cliente não encontrado'})

@app.route('/editar', methods=['POST'])
def editar():
    data = request.get_json()
    app.logger.debug('Dados recebidos para edição: %s', data)
    cliente = Cliente.query.filter_by(id=data['id']).first()
    if cliente:
        try:
            for key, value in data.items():
                if key in ['altura', 'peso', 'medida_ombro', 'medida_cintura', 'medida_quadril', 'medida_rosto', 'medida_tronco', 'medida_perna', 'busto']:
                    value = parse_float(value)
                elif key == 'valor':
                    value = f"R$ {parse_float(value):,.2f}".replace('.', ',')
                setattr(cliente, key, value or "")
            cliente.data_atendimento = data.get('data_atendimento', '')
            cliente.data_pagamento = data.get('data_pagamento', '')
            db.session.commit()
            app.logger.debug('Dados atualizados para o cliente: %s', cliente.to_dict())
            return jsonify({'result': 'Cliente editado com sucesso!'})
        except Exception as e:
            app.logger.error('Erro ao editar cliente: %s', e)
            return jsonify({'result': 'Erro ao editar cliente'}), 400
    return jsonify({'result': 'Cliente não encontrado'})

@app.route('/excluir', methods=['POST'])
def excluir():
    data = request.get_json()
    app.logger.debug('Dados recebidos para exclusão: %s', data)
    cliente = Cliente.query.filter_by(id=data['id']).first()
    if cliente:
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({'result': 'Cliente excluído com sucesso!'})
    return jsonify({'result': 'Cliente não encontrado'})

@app.route('/carregar', methods=['GET'])
def carregar():
    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes])

if __name__ == '__main__':
    with app.app_context():
        if not os.path.exists('clientes.db'):
            db.create_all()
    app.run(debug=True, host='127.0.0.1', port=5000)

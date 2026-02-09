def calcular_preco_litro(preco_unitario, volume_ml):
    litros = volume_ml / 1000
    return preco_unitario / litros


def calcular_caixa(preco_unitario, quantidade):
    return preco_unitario * quantidade


def calcular_litros_caixa(volume_ml, quantidade):
    litros_unitario = volume_ml / 1000
    return litros_unitario * quantidade
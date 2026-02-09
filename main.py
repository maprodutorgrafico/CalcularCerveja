import json
import os

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.spinner import Spinner
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.scrollview import ScrollView
from kivy.graphics import Color, RoundedRectangle

from calculadora import (
    calcular_preco_litro,
    calcular_caixa,
    calcular_litros_caixa
)

ARQUIVO_VASILHAMES = "vasilhames.json"

def carregar_vasilhames():
    if os.path.exists(ARQUIVO_VASILHAMES):
        with open(ARQUIVO_VASILHAMES, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def salvar_vasilhames(vasilhames):
    with open(ARQUIVO_VASILHAMES, "w", encoding="utf-8") as f:
        json.dump(vasilhames, f, ensure_ascii=False, indent=4)


class Card(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation="vertical", padding=15, spacing=10, **kwargs)
        self.size_hint_y = None
        self.bind(minimum_height=self.setter("height"))

        with self.canvas.before:
            Color(0.15, 0.15, 0.15, 1)
            self.bg = RoundedRectangle(radius=[15])

        self.bind(pos=self._update_bg, size=self._update_bg)

    def _update_bg(self, *args):
        self.bg.pos = self.pos
        self.bg.size = self.size


class CervejaApp(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation="vertical", padding=15, spacing=15, **kwargs)

        self.vasilhames = carregar_vasilhames()

        # Scroll (para celular)
        scroll = ScrollView()
        content = BoxLayout(orientation="vertical", spacing=15, size_hint_y=None)
        content.bind(minimum_height=content.setter("height"))
        scroll.add_widget(content)

        # ===== Título =====
        titulo = Label(
            text="🍺 Calculadora de Cerveja",
            font_size=22,
            size_hint_y=None,
            height=40
        )

        # ===== Card Entrada =====
        card_entrada = Card()

        self.spinner = Spinner(
            text="Escolha o vasilhame",
            values=list(self.vasilhames.keys()),
            size_hint_y=None,
            height=45
        )

        self.preco_input = TextInput(
            hint_text="Preço da unidade (ex: 3.50)",
            input_filter="float",
            size_hint_y=None,
            height=45
        )

        btn_calcular = Button(
            text="Calcular",
            size_hint_y=None,
            height=45
        )
        btn_calcular.bind(on_press=self.calcular)

        card_entrada.add_widget(self.spinner)
        card_entrada.add_widget(self.preco_input)
        card_entrada.add_widget(btn_calcular)

        # ===== Card Resultado =====
        self.card_resultado = Card()

        self.resultado = Label(
            text="",
            halign="left",
            valign="top",
            size_hint_y=None
        )
        self.resultado.bind(
            width=lambda *x: self.resultado.setter("text_size")(self.resultado, (self.resultado.width, None)),
            texture_size=lambda *x: self._atualizar_altura()
        )

        self.card_resultado.add_widget(self.resultado)

        # ===== Card Cadastro =====
        card_cadastro = Card()

        titulo_cadastro = Label(
            text="Cadastrar novo vasilhame",
            size_hint_y=None,
            height=30
        )

        self.nome_vasilhame = TextInput(
            hint_text="Nome do vasilhame (ex: Latão 473 ml)",
            size_hint_y=None,
            height=45
        )

        self.volume_vasilhame = TextInput(
            hint_text="Volume em ml (ex: 473)",
            input_filter="int",
            size_hint_y=None,
            height=45
        )

        btn_add = Button(
            text="Adicionar vasilhame",
            size_hint_y=None,
            height=45
        )
        btn_add.bind(on_press=self.adicionar_vasilhame)

        card_cadastro.add_widget(titulo_cadastro)
        card_cadastro.add_widget(self.nome_vasilhame)
        card_cadastro.add_widget(self.volume_vasilhame)
        card_cadastro.add_widget(btn_add)

        # Montagem
        content.add_widget(titulo)
        content.add_widget(card_entrada)
        content.add_widget(self.card_resultado)
        content.add_widget(card_cadastro)

        self.add_widget(scroll)

    def _atualizar_altura(self):
        self.resultado.height = self.resultado.texture_size[1]

    def calcular(self, instance):
        try:
            preco = float(self.preco_input.text)
            volume = self.vasilhames[self.spinner.text]

            preco_litro = calcular_preco_litro(preco, volume)

            # Pack 6
            pack_6 = calcular_caixa(preco, 6)
            litros_6 = calcular_litros_caixa(volume, 6)

            # Caixa 12
            caixa_12 = calcular_caixa(preco, 12)
            litros_12 = calcular_litros_caixa(volume, 12)

            # Caixa 15
            caixa_15 = calcular_caixa(preco, 15)
            litros_15 = calcular_litros_caixa(volume, 15)

            # Caixa 18
            caixa_18 = calcular_caixa(preco, 18)
            litros_18 = calcular_litros_caixa(volume, 18)

            self.resultado.text = (
                f"💧 Preço por litro: R$ {preco_litro:.2f}\n\n"
                f"📦 Pack com 6\n"
                f"• Preço: R$ {pack_6:.2f}\n"
                f"• Litros: {litros_6:.2f} L\n\n"
                f"📦 Caixa com 12\n"
                f"• Preço: R$ {caixa_12:.2f}\n"
                f"• Litros: {litros_12:.2f} L\n\n"
                f"📦 Caixa com 15\n"
                f"• Preço: R$ {caixa_15:.2f}\n"
                f"• Litros: {litros_15:.2f} L\n\n"                
                f"📦 Caixa com 18\n"
                f"• Preço: R$ {caixa_18:.2f}\n"
                f"• Litros: {litros_18:.2f} L"
            )

        except:
            self.resultado.text = "Preencha corretamente os campos."

    def adicionar_vasilhame(self, instance):
        try:
            nome = self.nome_vasilhame.text.strip()
            volume = int(self.volume_vasilhame.text)

            if nome and volume > 0:
                self.vasilhames[nome] = volume
                salvar_vasilhames(self.vasilhames)

                self.spinner.values = list(self.vasilhames.keys())
                self.spinner.text = nome

                self.nome_vasilhame.text = ""
                self.volume_vasilhame.text = ""
        except:
            pass


class CalculadoraCervejaApp(App):
    def build(self):
        return CervejaApp()


if __name__ == "__main__":
    CalculadoraCervejaApp().run()
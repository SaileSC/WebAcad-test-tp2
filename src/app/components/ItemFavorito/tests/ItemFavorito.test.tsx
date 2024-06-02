import {
  FavoritosProvider,
  useProdutoFavorito,
  useProdutosFavoritos,
} from "@/app/State/FavoritosProvider";
import { mockProdutos } from "@/app/mocks/produtos";
import { render, screen } from "@testing-library/react";
import ItemFavorito from "../ItemFavorito";
import { calculaValorComPorcentagemDeDesconto } from "@/app/helpers";
import userEvent from "@testing-library/user-event";

jest.mock("../../../State/FavoritosProvider", () => ({
  ...jest.requireActual("../../../State/FavoritosProvider"),
  useProdutosFavoritos: jest.fn(),
}));

describe("ItemFavorito", () => {
  test("Deve renderizar corretamente o Item favorito", () => {
    const useProdutoFavoritoMock = useProdutosFavoritos as jest.Mock;
    useProdutoFavoritoMock.mockReturnValue(false);

    const produtoFavoritoMock = mockProdutos[0];
    const { nome, preco, fotos, desconto, descricao } = produtoFavoritoMock;

    const precoComDesconto = calculaValorComPorcentagemDeDesconto(
      Number(preco),
      desconto
    ).toFixed(2);

    render(
      <FavoritosProvider>
        <table>
          <tbody>
            <ItemFavorito
              itemFavorito={produtoFavoritoMock}
              setFavoritos={useProdutoFavoritoMock}
            ></ItemFavorito>
          </tbody>
        </table>
      </FavoritosProvider>
    );

    expect(
      screen.getByRole("img", { name: fotos[0].titulo })
    ).toBeInTheDocument();

    expect(screen.getByText(nome)).toBeInTheDocument();
    expect(screen.getByText(descricao)).toBeInTheDocument();
    expect(screen.getByText(`R$ ${precoComDesconto}`)).toBeInTheDocument();
    expect(screen.getByText(`${desconto}%`)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Remover" })).toBeEnabled();
  });

  test("Deve ser possivel remover o item usando o botao", async () => {
    const useProdutoFavoritoMock = useProdutosFavoritos as jest.Mock;
    useProdutoFavoritoMock.mockReturnValue(false);
    const setFavoritos = jest.fn();

    const produtoFavoritoMock = mockProdutos[0];

    render(
      <FavoritosProvider>
        <table>
          <tbody>
            <ItemFavorito
              itemFavorito={produtoFavoritoMock}
              setFavoritos={setFavoritos}
            ></ItemFavorito>
          </tbody>
        </table>
      </FavoritosProvider>
    );

    const botaoRemover = screen.getByRole("button", { name: "Remover" });

    expect(botaoRemover).toBeEnabled();

    await userEvent.click(botaoRemover);

    expect(setFavoritos).toHaveBeenCalledTimes(1);
  });
});

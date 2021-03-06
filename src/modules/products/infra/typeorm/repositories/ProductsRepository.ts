import { getRepository, Repository, In, FindOperator } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
      const findProduct = this.ormRepository.findOne({ where: {
        name,
      }});

      return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
      const productsId = products.map(product => product.id); // [1, 2, 3, 4 ...]

      const existentProducts = this.ormRepository.find({ 
        where: {
          id: In(productsId) // se nesse array de productsId existe algum produto
        }
      });

      return existentProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    return this.ormRepository.save(products);
  }
}

export default ProductsRepository;

import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {

    const customer = await this.customersRepository.findById(customer_id);

    if(!customer) throw new AppError('Customer not found');

    const findProducts = await this.productsRepository.findAllById(products);

    if(!findProducts.length) throw new AppError('Could not find any products with giver IDs');
    // se ele mandar o ID errado.

    const findProductsIds = findProducts.map(p => p.id);

    const checkInexistentProducts = products.filter(p => !findProductsIds.includes(p.id));

    if(checkInexistentProducts.length) throw new AppError('Could not find product');

    const findProductsWithNoQuantityAvailable = products.filter(product => 
      findProducts.filter(p => p.id === product.id)[0].quantity < product.quantity,
    );

    if(findProductsWithNoQuantityAvailable.length) throw new AppError('Quantity is not available');


    const serializedProducts = products.map(product => {
      return {
        product_id: product.id,
        quantity: product.quantity,
        price: findProducts.filter(p => p.id === product.id)[0].price,
      }
    });

    const order = await this.ordersRepository.create({ customer, products: serializedProducts });

    const orderProductsQuantity = products.map(product => ({
      id: product.id,
      quantity: findProducts.filter(p => p.id === product.id)[0].quantity - product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderProductsQuantity);

    return order;
  }
}

export default CreateOrderService;

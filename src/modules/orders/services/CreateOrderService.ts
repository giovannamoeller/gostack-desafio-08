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

  public async execute({ customer_id, products }: IRequest): Promise<void> {

    const customer = await this.customersRepository.findById(customer_id);

    if(!customer) throw new AppError('Customer not found');

    const findProducts = await this.productsRepository.findAllById(products);

    if(!findProducts.length) throw new AppError('Could not find any products with this ID');

    const existentProductsId = findProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(product => !existentProductsId.includes(product.id));
    
    const serializedProducts = products.map(product => ({
      product_id: '843848484848',
      quantity: 1,
      price: 20,
    }));

    const order = await this.ordersRepository.create({ customer, products: serializedProducts });

    //return order;
  }
}

export default CreateOrderService;

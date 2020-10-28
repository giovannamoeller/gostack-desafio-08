import Order from '../infra/typeorm/entities/Order';

import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

export default interface IOrdersRepository {
  create(data: ICreateOrderDTO): Promise<void>;
  findById(id: string): Promise<void>;
}

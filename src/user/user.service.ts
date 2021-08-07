import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    return users;
  }
  async login(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    console.log(await user.comparePassword(password));
    if (!user || !(await user.comparePassword(password))) {
      console.log(password);
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.userToken;
  }
  async register(data: UserDTO) {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(data);
    this.userRepository.save(user);
    return user.userToken;
  }
}

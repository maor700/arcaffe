import { Injectable } from '@nestjs/common';
import { User, Material } from './data/types';
import USERS from './data/USERS';
import MATERIALS from './data/MATERIALS';

@Injectable()
export class AppService {
  getUsers(id?: string) {
    return id ? (USERS as User[])?.find?.((_) => _.id == id) : USERS;
  }

  getMaterials(id?: string) {
    return id
      ? (MATERIALS as Material[])?.find?.((_) => _.id == id)
      : MATERIALS;
  }
}

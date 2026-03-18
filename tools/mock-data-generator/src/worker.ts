import { faker } from '@faker-js/faker';

export type MockFieldType =
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'company'
  | 'jobTitle'
  | 'address'
  | 'city'
  | 'country'
  | 'date'
  | 'number'
  | 'boolean'
  | 'word'
  | 'sentence'
  | 'paragraph'
  | 'uuid';

export interface MockField {
  name: string;
  type: MockFieldType;
}

const api = {
  generateData: async (fields: MockField[], count: number): Promise<any[]> => {
    faker.seed(); // ensure random
    const result: any[] = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, any> = {};

      for (const field of fields) {
        let val: any;
        switch (field.type) {
          case 'id':
            val = faker.string.uuid();
            break;
          case 'firstName':
            val = faker.person.firstName();
            break;
          case 'lastName':
            val = faker.person.lastName();
            break;
          case 'fullName':
            val = faker.person.fullName();
            break;
          case 'email':
            val = faker.internet.email();
            break;
          case 'phone':
            val = faker.phone.number();
            break;
          case 'company':
            val = faker.company.name();
            break;
          case 'jobTitle':
            val = faker.person.jobTitle();
            break;
          case 'address':
            val = faker.location.streetAddress();
            break;
          case 'city':
            val = faker.location.city();
            break;
          case 'country':
            val = faker.location.country();
            break;
          case 'date':
            val = faker.date.recent().toISOString();
            break;
          case 'number':
            val = faker.number.int({ min: 1, max: 1000 });
            break;
          case 'boolean':
            val = faker.datatype.boolean();
            break;
          case 'word':
            val = faker.lorem.word();
            break;
          case 'sentence':
            val = faker.lorem.sentence();
            break;
          case 'paragraph':
            val = faker.lorem.paragraph();
            break;
          case 'uuid':
            val = faker.string.uuid();
            break;
          default:
            val = faker.lorem.word();
        }
        row[field.name] = val;
      }
      result.push(row);
    }

    return result;
  },
};

export type WorkerAPI = typeof api;

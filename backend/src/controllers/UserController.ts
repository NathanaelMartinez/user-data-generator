import { Request, Response } from 'express';
import { faker } from '@faker-js/faker'

export const generateUsers = (req: Request, res: Response) => {
    const users = Array.from({ length: 20 }, () => {
        const firstName = faker.person.firstName();
        const middleName = faker.person.middleName();
        const lastName = faker.person.lastName();
        
        return {
            id: faker.string.uuid(),
            name: `${firstName} ${middleName} ${lastName}`, // full name with middle name
            address: faker.location.streetAddress(),
            phone: faker.phone.number(),
        };
    });
    res.json(users);
};

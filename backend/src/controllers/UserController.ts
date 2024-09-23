import { Request, Response } from "express";
import { allFakers } from '@faker-js/faker';
import seedrandom from 'seedrandom';

export const generateUsers = (req: Request, res: Response) => {
    const { localeId, seed } = req.params;
    
    if (localeId in allFakers) {
        const faker = allFakers[localeId as keyof typeof allFakers]; // this let's use localeId as key

        // create seeded random number generator
        const rng = seedrandom(seed);
        const seedValue = Math.floor(rng() * 1000000); // generate numeric seed value

        faker.seed(seedValue);
        
        const users = Array.from({ length: 20 }, () => {
            const firstName = faker.person.firstName();
            const middleName = faker.person.middleName();
            const lastName = faker.person.lastName();

            return {
                id: faker.string.uuid(),
                name: `${firstName} ${middleName} ${lastName}`,
                address: faker.location.streetAddress(),
                phone: faker.phone.number(),
            };
        });
        res.json(users);
    } else {
        return res.status(400).json({ error: "Invalid locale ID: needs to be in ISO 639-1" });
    }
};

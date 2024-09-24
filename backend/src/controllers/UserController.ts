import { Request, Response } from "express";
import { allFakers } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import _ from 'underscore';

interface User {
    id: string;
    name: string;
    address: string;
    phone: string;
}

export const generateRandomUser = (faker: any): User => {
    // const firstName = faker.person.firstName();
    // const middleName = faker.person.middleName();
    // const lastName = faker.person.lastName();

    return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
    };
};

// Helper function to randomly select from an array using a seeded random generator
function seededSample<T>(array: T[], rng: seedrandom.PRNG): T {
    const index = Math.floor(rng() * array.length);
    return array[index];
}

// Function to apply random errors based on the specified count
function applyErrors(user: User, errorCount: number, rng: seedrandom.PRNG): User {
    const errorTypes = ['delete', 'add', 'swap'];
    const fields = ['name', 'address', 'phone']; // user fields to apply errors to

    if (errorCount === 0) { // shouldn't apply any errors if none
        return user;
    }

    // apply integer part of errorCount
    const integerPart = Math.floor(errorCount);
    for (let i = 0; i < integerPart; i++) {
        const selectedField = seededSample(fields, rng) as keyof User; // Use seededSample for consistent field selection
        const errorType = seededSample(errorTypes, rng);
        user = applyError(user, selectedField, errorType, rng);
    }

    // apply fractional part of errorCount
    const fractionalPart = errorCount % 1;
    if (rng() < fractionalPart) {
        const selectedField = seededSample(fields, rng) as keyof User; // Use seededSample for consistent field selection
        const errorType = seededSample(errorTypes, rng);
        user = applyError(user, selectedField, errorType, rng);
    }

    return user;
}

// Helper function to apply the selected error
function applyError(user: User, field: keyof User, errorType: string, rng: seedrandom.PRNG): User {
    switch (errorType) {
        case 'delete':
            if (user[field]) user[field] = deleteRandomCharacter(user[field], rng);
            break;
        case 'add':
            if (user[field]) user[field] = addRandomCharacter(user[field], rng);
            break;
        case 'swap':
            if (user[field]) user[field] = swapRandomCharacters(user[field], rng);
            break;
    }
    return user;
}

// Random error functions
function deleteRandomCharacter(str: string, rng: seedrandom.PRNG): string {
    const index = Math.floor(rng() * str.length);
    return str.slice(0, index) + str.slice(index + 1); // delete character at random index
}

function addRandomCharacter(str: string, rng: seedrandom.PRNG): string {
    const index = Math.floor(rng() * str.length);
    const randomChar = String.fromCharCode(Math.floor(rng() * 26) + 97); // random letter
    return str.slice(0, index) + randomChar + str.slice(index); // insert random character
}

function swapRandomCharacters(str: string, rng: seedrandom.PRNG): string {
    if (str.length < 2) return str; // can't swap w/ less than 2 chars
    const index = Math.floor(rng() * (str.length - 1));
    const chars = str.split('');
    [chars[index], chars[index + 1]] = [chars[index + 1], chars[index]]; // swap adjacent characters
    return chars.join(''); // Return the modified string
}

// Main function to generate users
export const generateUsers = (req: Request, res: Response) => {
    const { localeId, seed, errorSize } = req.params;
    
    // validate locale ID
    if (localeId in allFakers) {
        const faker = allFakers[localeId as keyof typeof allFakers]; // set faker to locale

        // create a seeded random number generator based on passed seed
        const rng = seedrandom(seed);
        const seedValue = Math.floor(rng() * 1000000); // generate numeric seed value

        // seed faker for consistency
        faker.seed(seedValue);

        // generate users
        const users: User[] = Array.from({ length: 20 }, () => {
            const user = generateRandomUser(faker); // generate random user data using faker
            return applyErrors(user, Number(errorSize), rng); // apply errors based on errorSize
        });

        res.json(users); // return generated users with errors applied
    } else {
        return res.status(400).json({ error: "Invalid locale ID: needs to be in ISO 639-1" });
    }
};


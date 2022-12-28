import { subMonths } from 'date-fns';

export const fakeGames = [
  {
    _id: '63a8e7c221a8a33dbe9a3e61',
    title: 'FIFA 23',
    price: 765,
    tags: ['Sports', 'Football'],
    releaseDate: subMonths(new Date(), 14),
    publisher: {
      name: 'EA Sports',
      siret: 1,
      phone: '2348035662869',
      _id: '63a8e7c80e5ab6d164c28253',
    },
    __v: 0,
  },
  {
    _id: '63a8e79d0e95062a7ecb25b6',
    title: 'God of War',
    price: 453,
    tags: ['adventure', 'movie'],
    releaseDate: subMonths(new Date(), 19),
    publisher: {
      name: 'Sony Interactive Entertainment,',
      siret: 2,
      phone: '2348143272804',
      _id: '63a8e7971888f130d5f2cbaa',
    },
    __v: 0,
  },
  {
    _id: '63a8e7204749e037668c701e',
    title: 'Apex Legends',
    price: 665,
    tags: ['adventure', 'multiplayer'],
    releaseDate: subMonths(new Date(), 19),
    publisher: {
      name: 'Nintendo Switch',
      siret: 3,
      phone: '2348143272804',
      _id: '63a8e7191b87484cd9ff706c',
    },
    __v: 0,
  },
  {
    _id: '63a8e6e70d2deefe89c94694',
    title: 'WWE 2K22',
    price: 240,
    tags: ['Wrestling', 'Sports'],
    releaseDate: new Date(),
    publisher: {
      name: '2K Games',
      siret: 4,
      phone: '2348143272804',
      _id: '63a8e6df4885e6fadc20ff75',
    },
    __v: 0,
  },
];

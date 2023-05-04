import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { server, app } from '../src/index';
import { Trip } from '../src/types/types';
import { beforeEach } from 'jest-circus';
const prisma = new PrismaClient();

import { default as mocks } from './mocks';

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});

describe('UNIT TESTS', () => {
  describe('GET /result - getSearchTrips', () => {
    it('Should return an array of trips with status 200', async () => {
      const res = await request(app).get('/result').query({
        activities: 'hiking',
        budget: 100,
        depCity: 'Los Angeles',
        duration: 7,
      });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it('Should return status 400 if query is empty', async () => {
      const res = await request(app).get('/result').query({});

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /post - createTrip', () => {
    it('Should create a new trip and return the created trip with status 201', async () => {
      const res = await request(app).post('/post').send(mocks.tripData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', mocks.tripData.name);
      expect(res.body).toHaveProperty('user', mocks.tripData.user);
      expect(res.body).toHaveProperty('depCity', mocks.tripData.depCity);
      expect(res.body).toHaveProperty('arrCity', mocks.tripData.arrCity);
      expect(res.body).toHaveProperty('budget', mocks.tripData.budget);
      expect(res.body).toHaveProperty('duration', mocks.tripData.duration);
    });
    it('Should return status 400 if required input field is missing', async () => {
      const res = await request(app).post('/post').send(mocks.badTripData);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /journey - createJourney', () => {
    it('Should create a new journey and return the created journey with status 200', async () => {
      const resTrip = await request(app).post('/post').send(mocks.tripData);
      const idTrip = resTrip.body.id;
      mocks.journeyData.idTrip = idTrip;
      const res = await request(app).post('/journey').send(mocks.journeyData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject({
        idTrip: mocks.journeyData.idTrip,
        depCity: mocks.journeyData.depCity,
        arrCity: mocks.journeyData.arrCity,
        price: mocks.journeyData.price,
        transportType: mocks.journeyData.transportType,
      });
      expect(new Date(res.body.start).getTime()).toBeCloseTo(
        new Date(mocks.journeyData.start).getTime(),
        -2
      );
      expect(new Date(res.body.end).getTime()).toBeCloseTo(
        new Date(mocks.journeyData.end).getTime(),
        -2
      );
    });
    it('Should return status 400 if required input field is missing', async () => {
      const res = await request(app)
        .post('/journey')
        .send(mocks.badJourneyData);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /activity - createActivity', () => {
    it('Should create a new activity and return the created activity with status 200', async () => {
      const resTrip = await request(app).post('/post').send(mocks.tripData);
      const idTrip = resTrip.body.id;
      mocks.activityData.idTrip = idTrip;
      const res = await request(app).post('/activity').send(mocks.activityData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject({
        idTrip: mocks.activityData.idTrip,
        depCity: mocks.activityData.depCity,
        arrCity: null,
        price: mocks.activityData.price,
        activityType: mocks.activityData.activityType,
        additionalInfo: mocks.activityData.additionalInfo,
      });
      expect(new Date(res.body.start).getTime()).toBeCloseTo(
        new Date(mocks.activityData.start).getTime(),
        -2
      );
      expect(new Date(res.body.end).getTime()).toBeCloseTo(
        new Date(mocks.activityData.end).getTime(),
        -2
      );
    });
    it('Should return status 400 if required input field is missing', async () => {
      const res = await request(app)
        .post('/activity')
        .send(mocks.badActivityData);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /trip:id - getTripById', () => {
    it('Should return a trip with the specified ID and status 200', async () => {
      const id = 1;
      const res = await request(app).get(`/trip/${id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', id);
    });
    it('Should return 404 if trip is not found', async () => {
      const res = await request(app).get(`/trip/420blazeit`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /modify - getTripByUser', () => {
    it('Should return an array of trips with the specified user and status 200', async () => {
      await request(app).post('/post').send(mocks.tripData);

      const user = 'Test User';
      const res = await request(app).get('/modify').query({ user });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((trip: Trip) => {
        expect(trip).toHaveProperty('user', user);
      });
    });
    it('Should return status 400 if required input field is missing', async () => {
      const res = await request(app).get('/modify').query({});

      expect(res.statusCode).toEqual(400);
    });
    it('Should return status 404 if trip does not exist', async () => {
      const idTrip = 9999999;
      const res = await request(app).get('/modify').query({ idTrip });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /modify - deleteItem', () => {
    it('Should delete a trip with the specified ID and return the deleted trip with status 200', async () => {
      const postRes = await request(app).post('/post').send(mocks.tripData);
      let idtrip = postRes.body.id;

      const res = await request(app).delete('/modify').query({ idtrip });

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(idtrip);
    });

    it('Should delete a journey with the specified ID and return the deleted journey with status 200', async () => {
      const resTrip = await request(app).post('/post').send(mocks.tripData);
      const idTrip = resTrip.body.id;
      mocks.journeyData.idTrip = idTrip;

      const resJourney = await request(app)
        .post('/journey')
        .send(mocks.journeyData);

      const idjourney = resJourney.body.id;
      const res = await request(app).delete('/modify').query({ idjourney });

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(idjourney);
    });

    it('Should delete an activity with the specified ID and return the deleted activity with status 200', async () => {
      const resTrip = await request(app).post('/post').send(mocks.tripData);
      const idTrip = resTrip.body.id;
      mocks.activityData.idTrip = idTrip;

      const resActivity = await request(app)
        .post('/activity')
        .send(mocks.activityData);

      const idactivity = resActivity.body.id;

      const res = await request(app).delete('/modify').query({ idactivity });

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(idactivity);
    });

    it('Should return status 400 if required input field is missing', async () => {
      const res = await request(app).delete('/modify').query({});

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('PUT /modify - modifyTrip', () => {
    it('Should update a trip with the specified ID and return the updated trip with status 200', async () => {
      const postRes = await request(app).post('/post').send(mocks.tripData);
      const idtrip2 = postRes.body.id;
      const res = await request(app)
        .put('/modify')
        .query({ idtrip2 })
        .send({ ...mocks.updatedTripData });

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(idtrip2);

      expect(new Date(res.body.start).getTime()).toBeCloseTo(
        new Date(mocks.updatedTripData.start).getTime(),
        -2
      );
      expect(new Date(res.body.end).getTime()).toBeCloseTo(
        new Date(mocks.updatedTripData.end).getTime(),
        -2
      );
    });
    it('Should return status 400 if required input field is missing', async () => {
      const res = await request(app).put('/modify').query({});

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /explore - getActivitiesList', () => {
    it('Should return an array of all activities with status 200', async () => {
      const res = await request(app).get('/explore');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

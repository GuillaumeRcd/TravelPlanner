import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Trip } from '../types/types';
const prisma = new PrismaClient();

function lowerCase(string: string) {
  return string.toLowerCase();
}

const putCapLet = function (string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({});
    res.json(trips);
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400);
  }
};

export const getActivitiesList = async (req: Request, res: Response) => {
  try {
    const trips = await prisma.activity.findMany({});
    res.json(trips);
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400);
  }
};

export const getSearchTrips = async (req: Request, res: Response) => {
  try {
    const a = req.query;
    let activityArray: string[] = [];
    if (typeof a.activities === 'string') {
      activityArray = a.activities.split(' ');
    }
    if (!a.activities) {
      res.status(400).send();
      return;
    }

    const searchItemsArr = activityArray.map((string) =>
      putCapLet(string.toLowerCase())
    );
    const budgetTrip: number = +a.budget!;
    const depCityTrip = putCapLet(lowerCase(a.depCity!.toString()));
    const durationTrip = a.duration;

    const getTrips: Trip[] = await prisma.trip.findMany({
      where: {
        activities: {
          some: {
            activityType: {
              in: searchItemsArr,
            },
          },
        },
      },
      include: {
        journeys: true,
        activities: true,
      },
    });

    const results = getTrips
      .filter((trip: Trip) => trip.budget <= +budgetTrip!)
      .filter((trip: Trip) => trip.depCity === depCityTrip)
      .filter((trip: Trip) => trip.duration! <= +durationTrip!);
    res.json(results);
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getTripById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const trips = await prisma.trip.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        journeys: true,
        activities: true,
      },
    });
    if (!trips) {
      res.status(404).send();
      return;
    }
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { name, user, depCity, arrCity, budget, duration } = req.body;
    if (!name || !user || !depCity || !budget) {
      res.status(400).send();
      return;
    }
    const trip = await prisma.trip.create({
      data: {
        name: name,
        user: user,
        depCity: depCity,
        arrCity: arrCity,
        budget: budget,
        duration: duration,
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const createJourney = async (req: Request, res: Response) => {
  try {
    const { start, end, depCity, arrCity, price, transportType, idTrip } =
      req.body;
    if (
      !start ||
      !end ||
      !depCity ||
      !arrCity ||
      !price ||
      !transportType ||
      !idTrip
    ) {
      res.status(400).send();
      return;
    }
    const journey = await prisma.journey.create({
      data: {
        start: start,
        end: end,
        depCity: depCity,
        arrCity: arrCity,
        price: price,
        transportType: transportType,
        trip: { connect: { id: idTrip } },
      },
    });
    res.status(201).json(journey);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const {
      start,
      end,
      depCity,
      arrCity,
      price,
      activityType,
      additionalInfo,
      idTrip,
    } = req.body;
    if (!start || !end || !depCity || !price || !activityType || !idTrip) {
      res.status(400).send();
      return;
    }
    const activity = await prisma.activity.create({
      data: {
        start: start,
        end: end,
        depCity: depCity,
        arrCity: arrCity,
        price: price,
        activityType: activityType,
        additionalInfo: additionalInfo,
        trip: { connect: { id: idTrip } },
      },
    });
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getTripByUser = async (req: Request, res: Response) => {
  if (req.query.user) {
    try {
      const user = req.query.user as string | undefined;
      const trips = await prisma.trip.findMany({
        where: {
          user: user,
        },
        include: {
          journeys: true,
          activities: true,
        },
      });
      if (trips.length < 1) {
        res.status(404).send();
        return;
      }
      res.json(trips);
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  } else if (req.query.idTrip) {
    try {
      const idTrip = req.query.idTrip;
      if (!isNaN(+idTrip)) {
        const trips = await prisma.trip.findMany({
          where: {
            id: +idTrip,
          },
          include: {
            journeys: true,
            activities: true,
          },
        });

        if (trips.length < 1) {
          res.status(404).send();
          return;
        }
        res.json(trips);
        res.status(200);
      } else {
        res.status(400).send();
      }
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  } else {
    res.status(400).send();
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  if (req.query.idjourney) {
    const id = req.query.idjourney;
    try {
      const deletedJourney = await prisma.journey.delete({
        where: {
          id: +id,
        },
      });
      res.json(deletedJourney);
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  } else if (req.query.idactivity) {
    const id = req.query.idactivity;

    try {
      const deletedActivity = await prisma.activity.delete({
        where: {
          id: +id,
        },
      });
      res.json(deletedActivity);
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  } else if (req.query.idtrip) {
    const id = req.query.idtrip;
    try {
      const deletedTrip = await prisma.trip.delete({
        where: {
          id: +id,
        },
      });
      res.json(deletedTrip);
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  } else {
    res.status(400).send();
  }
};

export const modifyTrip = async (req: Request, res: Response) => {
  const id = req.query.idtrip2;
  if (!id) {
    res.status(400).send();
    return;
  }
  const { name, user, depCity, arrCity, budget, duration, start, end } =
    req.body;

  try {
    const updatedTrip = await prisma.trip.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        user,
        depCity,
        arrCity,
        budget: parseFloat(budget),
        duration: Number(duration),
        start,
        end,
      },
    });
    res.json(updatedTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating trip' });
  }
};

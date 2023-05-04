import express from 'express';
const router = express.Router();

import {
  getSearchTrips,
  createTrip,
  createJourney,
  createActivity,
  getTripById,
  getTripByUser,
  deleteItem,
  modifyTrip,
  getActivitiesList,
} from '../controllers/controller';

router.get('/result', getSearchTrips);
router.post('/post', createTrip);
router.post('/journey', createJourney);
router.post('/activity', createActivity);
router.get('/trip/:id', getTripById);
router.get('/modify', getTripByUser);
router.delete('/modify', deleteItem);
router.put('/modify', modifyTrip);
router.get('/explore', getActivitiesList);

export default router;

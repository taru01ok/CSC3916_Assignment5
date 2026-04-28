import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const env = process.env;

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const submitReview = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    fetch(`${env.REACT_APP_API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ movieId, username, review, rating: Number(rating) }),
      mode: 'cors'
    }).then(res => res.json())
      .then(() => {
        setMessage('Review submitted!');
        setRating('');
        setReview('');
        dispatch(fetchMovie(movieId));
      })
      .catch(() => setMessage('Failed to submit review.'));
  };

  if (!selectedMovie) return <div>Loading...</div>;

  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>
      <Card.Body>
        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>
      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
        <ListGroupItem>
          {selectedMovie.actors.map((actor, i) => (
            <p key={i}><b>{actor.actorName}</b> {actor.characterName}</p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4><BsStarFill /> {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'No ratings yet'}</h4>
        </ListGroupItem>
      </ListGroup>
      <Card.Body className="card-body bg-white">
        <h5>Reviews</h5>
        {selectedMovie.reviews && selectedMovie.reviews.map((r, i) => (
          <p key={i}><b>{r.username}</b> {r.review} <BsStarFill /> {r.rating}</p>
        ))}
        <hr />
        <h5>Submit a Review</h5>
        {message && <p style={{color: 'green'}}>{message}</p>}
        <Form onSubmit={submitReview}>
          <Form.Group className="mb-3">
            <Form.Label>Rating (0-5)</Form.Label>
            <Form.Control type="number" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control as="textarea" rows={3} value={review} onChange={e => setReview(e.target.value)} required />
          </Form.Group>
          <Button type="submit">Submit Review</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;

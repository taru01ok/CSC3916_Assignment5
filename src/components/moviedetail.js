import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button, Alert } from 'react-bootstrap';
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
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const submitReview = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('You must be logged in to submit a review.');
      return;
    }

    fetch(`${env.REACT_APP_API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ movieId, username, review, rating: Number(rating) }),
      mode: 'cors'
    }).then(res => {
      if (!res.ok) throw new Error('Failed');
      return res.json();
    }).then(() => {
        setMessage('Review submitted!');
        setRating('');
        setReview('');
        dispatch(fetchMovie(movieId));
      })
      .catch(() => setError('Failed to submit review. Please try again.'));
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
            <p key={i}><b>{actor.actorName}</b> as {actor.characterName}</p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4><BsStarFill /> {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'No ratings yet'}</h4>
        </ListGroupItem>
      </ListGroup>
      <Card.Body className="card-body bg-white">
        <h5>Reviews</h5>
        {selectedMovie.reviews && selectedMovie.reviews.length > 0
          ? selectedMovie.reviews.map((r, i) => (
              <p key={i}><b>{r.username}</b>: {r.review} <BsStarFill /> {r.rating}</p>
            ))
          : <p>No reviews yet.</p>
        }
        <hr />
        <h5>Submit a Review</h5>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!token ? (
          <Alert variant="warning">Please log in to submit a review.</Alert>
        ) : (
          <Form onSubmit={submitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" rows={3} value={review} onChange={e => setReview(e.target.value)} required />
            </Form.Group>
            <Button type="submit">Submit Review</Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;

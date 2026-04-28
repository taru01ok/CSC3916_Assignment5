import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMovie } from '../actions/movieActions';
import { Form, Button, Card } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

const env = process.env;

function Search() {
  const [title, setTitle] = useState('');
  const [actorName, setActorName] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    fetch(`${env.REACT_APP_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ title, actorName }),
      mode: 'cors'
    }).then(res => res.json())
      .then(data => {
        setResults(data);
        setSearched(true);
      })
      .catch(err => console.log(err));
  };

  const handleClick = (movie) => {
    dispatch(setMovie(movie));
    navigate(`/movie/${movie._id}`);
  };

  return (
    <div className="p-4">
      <h2>Search Movies</h2>
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3">
          <Form.Label>Movie Title</Form.Label>
          <Form.Control type="text" placeholder="Enter title..." value={title} onChange={e => setTitle(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Actor Name</Form.Label>
          <Form.Control type="text" placeholder="Enter actor name..." value={actorName} onChange={e => setActorName(e.target.value)} />
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>

      {searched && results.length === 0 && <p className="mt-3">No results found.</p>}

      <div className="d-flex flex-wrap gap-3 mt-4">
        {results.map(movie => (
          <Card key={movie._id} onClick={() => handleClick(movie)} style={{ width: '200px', cursor: 'pointer' }}>
            {movie.imageUrl && <Card.Img variant="top" src={movie.imageUrl} style={{ height: '250px', objectFit: 'cover' }} />}
            <Card.Body>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text><BsStarFill /> {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Search;

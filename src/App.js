import React, { useEffect, useState } from "react";
import "./App.css";

import { API, graphqlOperation } from "aws-amplify";
import { listBooks } from "./graphql/queries";
import { createBook } from "./graphql/mutations";

function App() {
  const [books, setBooks] = useState([]);
  const [fetching, setFetching] = useState(false);

  async function fetchBooks() {
    setFetching(true);
    try {
      const bookData = await API.graphql(graphqlOperation(listBooks));
      const books = bookData.data.listBooks.items;
      setBooks(books);
      setFetching(false);
    } catch (err) {
      console.error("error fetching books!");
    }
    setFetching(false);
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const [bookForm, setBookForm] = useState({
    name: "",
    author: "",
    description: "",
    available: true,
    score: 0
  });

  const handleChange = (key) => {
    return (e) => {
      setBookForm({
        ...bookForm,
        [key]: e.target.value
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    API.graphql(graphqlOperation(createBook, { input: bookForm })).then(e => {
      setBookForm({
        name: "",
        author: "",
        description: "",
        available: true,
        score: 0
      });
      return fetchBooks();
    }).catch(err => {
        console.error(err);
    });
  }

  return (
    <div className="App">
      <header className="App-header"><h1>Book Store</h1></header>
      <div className="wrapper">
      <div>
        {fetching ? (
          <p>Fetching books...</p>
        ) : (
          <div>
            <h2>Our books:</h2>
            {books.length > 0 ? (
              <ul>
                {books.map((book) => (
                  <li>
                    <p>{book.name} - {book.author}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>We don't have any books right now <span role="img">😢</span></p>
            )}
          </div>
        )}
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <h2>Add new Book</h2>
        <input placeholder="Book Name" type="text" onChange={handleChange("name")} />
        <input placeholder="Author" type="text" onChange={handleChange("author")} />
        <input placeholder="Description" type="text" onChange={handleChange("description")} />
        <input placeholder="Score" type="number" onChange={handleChange("score")} />
        <button type="submit">Add Book</button>
      </form>
      </div>
    </div>
  );
}

export default App;

class BookRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render () {
        var stars;

        if (book.rating_icons.length == 0) {
            stars = (<i className="bi-star border-0"></i>);
        } else {
            stars = book.rating_icons.map(
                function(value, index) {
                    if (value === 'full') {
                        return (<i className="bi-star-fill border-0"></i>);
                    }
                    else if (value == 'half') {
                        return (<i className="bi-star-half border-0"></i>);
                    }
                }
            );
        }

        return (
            <div className="card-text book-rating mb-0">
                {stars}
            </div>
        )
    }
}

class BookCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className="col">
                <div className="card book-card shadow-sm">
                    <img src="{ book.cover.url }" className="card-img-top book-cover" />
                    <div className="card-body px-0 py-0">
                        <p className="card-title book-title mt-3 mb-1">{ book.title }</p>
                        <p className="card-text book-author mt-0 py-0">{ book.author }</p>
                        <BookRating book={book} />
                    </div>
                </div>
            </div>
        )
    }
}
class FeaturedBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className="row gx-3">
                <ul className="nav featured-books py-3">
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Recommended</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Last added</a>
                    </li>
                </ul>
                {this.props.recommended_books.map(function(book, index){
                    <BookCard book={book}/>
                })}
            </div>
        )
    }
}

class BookSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className="row justify-content-center py-4 px-3">
                <div className="col-4">
                    <div className="input-group mb-3 shadow">
                        <input type="text" className="form-control border-0" placeholder="Type book title or author" aria-label="Type book title or author" aria-describedby="basic-addon1" />
                        <span className="input-group-text border-0 bg-white" id="basic-addon1">
                            <i className="bi-search"></i>
                        </span>
                    </div>
                </div>
                <div className="col-2">
                    <select className="form-select border-0 shadow" aria-label="Book kind">
                        <option selected>Kind</option>
                        <option value="regular">Regular</option>
                        <option value="fiction">Fiction</option>
                        <option value="novel">Novel</option>
                    </select>
                </div>
            </div>
        )
    }
}

class BookListItem  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className="book-list-item d-flex flex-row bg-white p-3 my-3 shadow-sm">
                <div className="d-flex flex-row w-50">
                    <div className="">
                        <img src={book.cover.url} className="book-cover img-fluid" />
                    </div>
                    <div className="d-flex flex-column mx-3 p-1 flex-fill">
                        <div className="book-title">
                            {book.title}
                        </div>
                        <div className="book-author">
                            {book.author}
                        </div>
                    </div>
                </div>
                <div className="w-15 d-flex align-items-center book-rating">
                    <BookRating book={book} />
                </div>
                <div className="w-10 d-flex align-items-center">
                    <span className="badge rounded-pill bg-info">
                        { book.get_kind_display }
                    </span>
                </div>
                <div className="w-25">

                </div>
            </div>
        )
    }
}

class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="book-list">
                <div className="book-list-header d-flex flex-row py-2 px-3">
                    <div className="header-column w-50">Book Title</div>
                    <div className="header-column w-15">Rating</div>
                    <div className="header-column w-10">Kind</div>
                    <div className="header-column w-25">Status</div>
                </div>
                {this.props.books.map(function(book, index){
                    <BookListItem book={book} />
                })}
            </div>
        )
    }
}

class Books extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className="row py-5">
                <div className="col">
                    <div className="d-flex align-items-end flex-column py-4">
                        <button className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#addBookModal">
                            <i className="bi-plus"></i>
                            ADD BOOK
                        </button>
                    </div>
                    <BookList books={this.props.books} />
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="container py-4">
                <BookSearch />
                <FeaturedBooks />
                <Books />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
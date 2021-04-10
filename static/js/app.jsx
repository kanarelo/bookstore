class BookRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        var stars;
        var book = this.props.book;

        if (book.rating_icons !== undefined && book.rating_icons.length == 0) {
            stars = (<i className="bi-star border-0"></i>);
        } else {
            stars = book.rating_icons.map(
                function(value, index) {
                    if (value === 'full') {
                        return (<i key={index} className="bi-star-fill border-0"></i>);
                    }
                    else if (value == 'half') {
                        return (<i key={index} className="bi-star-half border-0"></i>);
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
        this.state = {
            hovered: false
        };
    }

    onMouseOver() {
        this.setState({ 'hovered': true });
    }
    onMouseOut() {
        this.setState({ 'hovered': false });
    }

    render () {
        var book = this.props.book;

        return (
            <div className={"card book-card " + (this.state.hovered ? "shadow" : "shadow-sm")} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
                <img src={ book.cover } className="card-img-top book-cover" />
                <div className="card-body px-0 py-0">
                    <p className="card-title book-title mt-3 mb-1">{ book.title }</p>
                    <p className="card-text book-author mt-0 py-0">{ book.author }</p>
                    <BookRating book={book} />
                </div>
            </div>
        )
    }
}


class FeaturedBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_link: 'recommended',
            books: []
        };
    }

    render () {
        var onRecommendedClick = function(e) {
            e.preventDefault();

            this.setState({ 'selected_link': 'recommended' });
        }
        var onLastAddedClick = function(e) {
            e.preventDefault();

            this.setState({ 'selected_link': 'latestAdded' });
        }

        var books = (
            this.state.selected_link === 'recommended' ? 
                this.props.recommended_books : 
                this.props.latest_books
            );

        return (
            <div className="row gx-3">
                <ul className="nav featured-books py-3">
                    <li className="nav-item">
                        <a href="" className={"nav-link" + (this.state.selected_link == 'recommended' ? ' active' : '')} onClick={onRecommendedClick.bind(this)} aria-current="page">Recommended</a>
                    </li>
                    <li className="nav-item">
                        <a href="" className={"nav-link" + (this.state.selected_link == 'latestAdded' ? ' active' : '')} onClick={onLastAddedClick.bind(this)}>Latest added</a>
                    </li>
                </ul>
                {books.map(function(book, index) {
                    return (
                        <div className="col" key={index}>
                            <BookCard book={book}/>
                        </div>
                    )
                })}
            </div>
        )
    }
}

class BookSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'search_text': '',
            'kind': ''
        };

        this.selectKindRef = React.createRef();
        this.searchInputRef = React.createRef();
    }

    searchFilter (e) {
        e.preventDefault();
        var data = {
            'search_text': this.searchInputRef.current.value,
            'kind': this.selectKindRef.current.value
        }

        this.setState(data);
        this.props.searchFilter(data);
    }

    render () {
        return (
            <div className="row justify-content-center py-4 px-3">
                <div className="col-4">
                    <div className="input-group mb-3 shadow">
                        <input ref={this.searchInputRef} value={this.state.search_text} type="text" onChange={this.searchFilter.bind(this)} className="form-control border-0" placeholder="Type book title or author" aria-label="Type book title or author" aria-describedby="basic-addon1" />
                        <span className="input-group-text border-0 bg-white" id="basic-addon1">
                            <i className="bi-search"></i>
                        </span>
                    </div>
                </div>
                <div className="col-2">
                    <select ref={this.selectKindRef} className="form-select border-0 shadow" aria-label="Book kind" onChange={this.searchFilter.bind(this)}>
                        <option value=''>Kind</option>
                        <option value="regular">Regular</option>
                        <option value="fiction">Fiction</option>
                        <option value="novel">Novel</option>
                    </select>
                </div>
            </div>
        )
    }
}

class BookListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        var book = this.props.book;

        return (
            <div className="book-list-item d-flex flex-row bg-white p-3 my-3 shadow-sm">
                <div className="d-flex flex-row w-50">
                    <div className="">
                        <img src={book.cover} className="book-cover img-fluid" />
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
                    return <BookListItem key={index} book={book} />;
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
    constructor(props) {
        super(props);
        this.state = {
            recommended_books: [],
            latest_books: [],
            all_books: [],
            loadingData: true,
            search_terms: {
                'search_text': '',
                'kind': ''
            }
        };
    }

    componentDidMount() {
        var handleData = function (response) {
            if (response.data !== undefined && response.data.success) {
                var data = response.data.response;

                this.setState({
                    recommended_books: data.recommended_books,
                    latest_books: data.latest_books,
                    all_books: data.all_books,
                    loadingData: false
                })
            }
        }

        axios
            .get('/library.json')
            .then(handleData.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    searchFilter(search_terms) {
        this.setState({ 'search_terms': search_terms });
    }

    filterBooks(book) {
        if (this.state.search_terms.search_text || this.state.search_terms.kind) {
            var name_matches = false;
            var author_matches = false;
            var book_is_of_kind = null;

            if (this.state.search_terms.search_text !== "") {
                var bookTitle = book.title.toUpperCase();
                var bookAuthor = book.author.toUpperCase();
                var searchText = this.state.search_terms.search_text.toUpperCase();

                name_matches = bookTitle.includes(searchText);
                author_matches = bookAuthor.includes(searchText);
            }

            if (this.state.search_terms.kind !== "") {
                book_is_of_kind = book.kind.toUpperCase() === this.state.search_terms.kind.toUpperCase();
            }

            if (book_is_of_kind == null) {
                return (name_matches || author_matches);
            } else {
                return (name_matches || author_matches) && book_is_of_kind;
            }
        }

        return true;
    }

    render() {
        return (
            <div className="container py-4">
                <div className={this.state.loadingData ? 'd-none': ''}>
                    <BookSearch searchFilter={this.searchFilter.bind(this)}/>
                    <FeaturedBooks 
                        recommended_books={this.state.recommended_books.filter(this.filterBooks.bind(this))} 
                        latest_books={this.state.latest_books.filter(this.filterBooks.bind(this))} />
                    <Books books={this.state.all_books.filter(this.filterBooks.bind(this))} />
                </div>
                <div className={'d-block position-fixed top-50 start-50 ' + (!this.state.loadingData ? ' d-none': '')}>
                    <div className="row align-items-center justify-content-center">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="text-center mt-3">
                            Loading Books...
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
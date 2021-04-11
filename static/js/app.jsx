const e = React.createElement;

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
    onClick(e) {
        e.preventDefault();

        if (this.props.embedded === false) {
            if (this.props.currentBook !== undefined) {
                this.props.currentBook(this.props.book);
            }
        }
    }

    render () {
        var shadowClass;
        var book = this.props.book;

        if (this.state.hovered) {
            if (this.props.embedded === false) {
                shadowClass = "shadow";
            } else {
                shadowClass = "";
            }
        }

        var content = (
            <React.Fragment>
                <img src={ book.cover } className="card-img-top book-cover" />
                <div className="card-body px-0 py-0">
                    <p className="card-title book-title mt-3 mb-1">{ book.title }</p>
                    <p className="card-text book-author mt-0 py-0">{ book.author }</p>
                    {this.props.showRating === true ? (
                        <BookRating book={book} />
                    ): (
                        <div/>
                    )}
                </div>
            </React.Fragment>
        );

        var props = {
            className: ("card book-card m-2 " + shadowClass),
            onMouseOver: this.onMouseOver.bind(this),
            onMouseOut: this.onMouseOut.bind(this),
            onClick: this.onClick.bind(this)
        }

        if (this.props.embedded === false) {
            props['data-bs-toggle'] = "modal";
            props['data-bs-target'] = "#viewBookModal";
        }

        return e('div', props, content);
    }
}


class FeaturedBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_link: 'recommended'
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
            <div className={"container" + (books.length == 0 ? " d-none" : "")}>
                <div className="row">
                    <ul className="nav featured-books py-3">
                        <li className="nav-item">
                            <a href="" className={"nav-link" + (this.state.selected_link == 'recommended' ? ' active' : '')} onClick={onRecommendedClick.bind(this)} aria-current="page">Recommended</a>
                        </li>
                        <li className="nav-item">
                            <a href="" className={"nav-link" + (this.state.selected_link == 'latestAdded' ? ' active' : '')} onClick={onLastAddedClick.bind(this)}>Latest added</a>
                        </li>
                    </ul>
                </div>
                <div className="row">
                    <div className="col p-2">
                        <div className="d-flex flex-row justify-content-start featured-books-cards">
                            {books.map(function(book, index) {
                                return (
                                    <BookCard book={book} key={index} embedded={false} currentBook={this.props.currentBook}/>
                                );
                            }.bind(this))}
                        </div>
                    </div>
                </div>
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
            <div className="container">
                <div className="row justify-content-center py-5 px-3">
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
                            <option value=''>Kind of Book</option>
                            <option value="regular">Regular</option>
                            <option value="fiction">Fiction</option>
                            <option value="novel">Novel</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

class ViewBookModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.modalRef = React.createRef();
    }

    render() {
        var book = this.props.book || {
            title: '',
            kind: '',
            rating: '',
            rating_icons: [],
            summary: '',
            cover: '',
            author: '',
            featured: '',
            created_at: '',
            updated_at: ''
        };


        return (
            <div className="modal fade" id="viewBookModal" tabIndex="-1" aria-labelledby="viewBookModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="viewBookModalLabel">
                                {book.title}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <div>
                                <div className="w-auto float-start">
                                    <BookCard book={book} embedded={true} />
                                </div>
                                <div className="w-60 float-start py-3 overflow-scroll">
                                    {book.summary}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="button" 
                                className="btn btn-warning" 
                                data-bs-dismiss="modal" 
                                data-bs-toggle="modal" 
                                data-bs-target="#bookCheckoutModal">
                                    Borrow Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class BookCheckoutModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: '',
            name: '',
            borrowing: null
        };
    }

    checkoutBook(e) {
        e.preventDefault();

        if (this.props.book.id !== null){
            this.setState({
                loading: true
            });

            var handleData = function (response) {
                if (response.data !== undefined && response.data.success) {
                    var data = response.data.data;
    
                    this.setState({
                        loading: false,
                        borrowing: data
                    })
                }
            }

            const url = '/books/' + this.props.book.id + '/borrow/check-out/';
            const formData = new FormData();
            
            formData.append('name', this.state.name);
            formData.append('email', this.state.email);
            
            axios
                .post(url, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                })
                .then(handleData.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    render() {
        var book = this.props.book || {
            id: null,
            title: '',
            kind: '',
            rating: '',
            rating_icons: [],
            summary: '',
            cover: '',
            author: '',
            featured: '',
            created_at: '',
            updated_at: ''
        };

        var setName = function(name) {
            this.setState({
                name: name
            })
        }.bind(this);
        var setEmail = function(email) {
            this.setState({
                email: email
            })
        }.bind(this);

        return (
            <div className="modal fade" id="bookCheckoutModal" tabIndex="-1" aria-labelledby="bookCheckoutModal" aria-hidden="true">
                <div className="modal-dialog">
                    <form className="modal-content" onSubmit={this.checkoutBook.bind(this)}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="bookCheckoutModalLabel">
                                {book.title}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            {this.state.borrowing === null ? (
                                <div className={'d-block position-fixed top-50 start-50 ' + (!this.state.loadingData ? ' d-none': '')}>
                                    <div className="row align-items-center justify-content-center">
                                        <div className="spinner-border text-success" role="status">
                                            <i className="bi-tick text-success"></i>
                                        </div>
                                        <div className="text-center mt-3">
                                            Book Checked Out Successfully!
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-auto float-start">
                                        <BookCard book={book} showRating={false} embedded={true} />
                                    </div>
                                    <div className="w-60 float-start py-4">
                                        <div className="form-floating mb-3">
                                            <input required onChange={function(event) { setName(event.target.value) }} type="text" className="form-control" id="customerName" placeholder="name@example.com" />
                                            <label htmlFor="customerName">Customer Name</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input required onChange={function(event) { setEmail(event.target.value) }} type="email" className="form-control" id="customerEmail" placeholder="name@example.com" />
                                            <label htmlFor="customerEmail">Customer E-mail</label>
                                        </div>
                                    </div>
                                </div>
                             )}
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-warning">
                                <span className={"spinner-grow spinner-grow-sm " + (this.state.loading ? "" : "d-none")} role="status" aria-hidden="true"></span> Checkout Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

class BookListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'hovered': false
        };
    }

    onMouseOver() {
        this.setState({ 'hovered': true });
    }
    onMouseOut() {
        this.setState({ 'hovered': false });
    }
    onClick(e) {
        e.preventDefault();

        this.props.currentBook(this.props.book);
    }

    render () {
        var book = this.props.book;

        return (
            <div 
                className={"book-list-item d-flex flex-row bg-white p-3 my-3" + (this.state.hovered ? " shadow" : " shadow-sm")} 
                onMouseOver={this.onMouseOver.bind(this)} 
                onMouseOut={this.onMouseOut.bind(this)}
                onClick={this.onClick.bind(this)}

                data-bs-toggle="modal" 
                data-bs-target="#viewBookModal"
            >
                <div className="d-flex flex-row w-50">
                    <div className="">
                        <img src={book.cover} className="book-cover" />
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
                    {book.kind}
                </div>
                <div className="w-10 d-flex align-items-center">
                    {book.available ? "Available" : "Borrowed"}
                </div>
                <div className="w-15 d-flex align-items-center">
                    <button className="btn btn-warning btn-sm shadow-sm" onClick={this.onClick.bind(this)} data-bs-toggle="modal" data-bs-target="#bookCheckoutModal">
                        Borrow Book
                    </button>
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
                    <div className="header-column w-10">Status</div>
                    <div className="header-column w-15">Action</div>
                </div>
                {this.props.books.map(function(book, index){
                    return <BookListItem key={index} book={book} currentBook={this.props.currentBook}/>;
                }.bind(this))}
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
            <div className={"container" + (this.props.books.length == 0 ? " d-none" : "")}>
                <div className="row py-5">
                    <div className="col">
                        <BookList books={this.props.books} currentBook={this.props.currentBook} />
                    </div>
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
            currentBook: null,
            search_terms: {
                'search_text': '',
                'kind': ''
            }
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(){
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

            if (this.state.search_terms.kind) {
                book_is_of_kind = book.kind.toUpperCase() === this.state.search_terms.kind.toUpperCase();
            }

            if (book_is_of_kind == null) {
                return (name_matches || author_matches);
            } else {
                return (name_matches || author_matches || book_is_of_kind);
            }
        }

        return true;
    }

    currentBook(book) {
        this.setState({
            'currentBook': book
        });
    }

    render() {
        return (
            <div className="container py-5">
                <div className={this.state.loadingData ? 'd-none': ''}>
                    <BookSearch 
                        searchFilter={this.searchFilter.bind(this)}/>
                    <FeaturedBooks 
                        currentBook={this.currentBook.bind(this)}
                        recommended_books={this.state.recommended_books.filter(this.filterBooks.bind(this))}
                        latest_books={this.state.latest_books.filter(this.filterBooks.bind(this))} />
                    <Books 
                        currentBook={this.currentBook.bind(this)}
                        books={this.state.all_books.filter(this.filterBooks.bind(this))} />
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
                <ViewBookModal 
                    book={this.state.currentBook} 
                    currentBook={this.currentBook.bind(this)}/>
                <BookCheckoutModal 
                    book={this.state.currentBook} 
                    currentBook={this.currentBook.bind(this)}/>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
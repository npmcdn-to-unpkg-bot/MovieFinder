var MovieSelection = React.createClass({

    handleChange: function () {
        this.props.handleChange(this.refs.select.value);
    },

    render: function () {
        var i = -1;
        var options = [<option value={i++}>please select...</option>]
        this.props.allMovies.map(function (movie) {
            options.push(
                <option value={i++}>{movie.Title}</option>
            )
        })

        var className = this.props.allMovies.length > 0 ? 'movie-selection' : 'movie-selection hidden';

        return (
            <select className={className} onChange={this.handleChange} ref='select'>
                {options}
            </select>
        )
    }
});

var SearchBox = React.createClass({

        handleChange: function () {
            this.props.handleChange(this.refs.input.value);
        },

        render: function () {
            var className = this.props.hidden ? 'search-box hidden' : 'search-box ';

            return (
                <input
                    className={className}
                    placeholder='search...'
                    type='text'
                    value={this.props.text}
                    onChange={this.handleChange}
                    ref='input'
                />
            )
        }
    })
    ;

var InputBox = React.createClass({

    render: function () {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <SearchBox
                    text={this.props.searchBoxText}
                    handleChange={this.props.handleSearchBoxChange}
                    hidden={this.props.allMovies.length > 0 ? true : false}
                />
                <MovieSelection
                    allMovies={this.props.allMovies}
                    handleChange={this.props.handleSelectionChange}
                />
            </form>
        )
    }
});

var Poster = React.createClass({
    render: function () {
        return (
            <img
                className='poster'
                src={this.props.posterSrc}
                alt='movie poster'
            >
            </img>
        );
    }
});

var Plot = React.createClass({
    render: function () {
        return (
            <p>
                {this.props.plot}
            </p>
        );
    }
});

window.App = React.createClass({

    getInitialState: function () {
        return {
            searchBoxText: '',
            posterSrc: 'https://pdfimages.wondershare.com/images/tutorial/movie-poster-template.jpg',
            allMovies: [],
            plot: ''
        };
    },

    handleFirstFetchFinished: function (movieData) {
        if (movieData.Error) {
            this.setState({
                searchBoxText: 'THE TITLE',
                posterSrc: 'https://pdfimages.wondershare.com/images/tutorial/movie-poster-template.jpg',
                allMovies: [],
                plot: ''
            })
        } else {
            this.setState({
                allMovies: movieData.Search,
                posterSrc: movieData.Search[0].Poster,
            });
        }
    },

    handleSecondFetchFinished: function (movieData) {
        this.setState({
            plot: 'Plot:\n'+movieData.Plot
        });
    },

    handleSearchBoxChange: function (searchBoxText) {
        this.setState({
            searchBoxText: searchBoxText
        });
    },

    handleSelectionChange: function (selectionIndex) {
        var selectedMovie = this.state.allMovies[selectionIndex];
        this.setState({
            searchBoxText: selectedMovie.Title + ' (' + selectedMovie.Year + ')',
            posterSrc: selectedMovie.Poster,
            allMovies: [],
        });
        Fetcher.sendRequest(selectedMovie.imdbID, this.handleSecondFetchFinished)
    },

    handleSubmit: function (e) {
        e.preventDefault();
        Fetcher.sendRequest(this.state.searchBoxText, this.handleFirstFetchFinished);
        this.setState({
            posterSrc: 'https://media.tenor.co/images/68418bb6d6155d587f94e794c9b07314/raw',
            plot: ''
        });
    },

    render: function () {
        return (
            <div className='container'>
                <InputBox
                    searchBoxText={this.state.searchBoxText}
                    allMovies={this.state.allMovies}
                    handleSearchBoxChange={this.handleSearchBoxChange}
                    handleSelectionChange={this.handleSelectionChange}
                    handleSubmit={this.handleSubmit}
                />
                <Poster posterSrc={this.state.posterSrc}/>
                <Plot plot={this.state.plot}/>
            </div>
        );
    }
})
;

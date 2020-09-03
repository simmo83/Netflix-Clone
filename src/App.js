import React from 'react';
import sampleFeed from './feed/sample.json' // for local testing

import './App.css';


/* COMPONENTS */
/* Render programs with filtering, sorting and pagination */
class ProgramList extends React.Component {
	constructor( props ) {
		super( props );

		const type = props.value;
		const dataFeed = props.data;
		const itemsToDisplay = 21;
		const releaseYear = 2010;

		this.state = {
			currentFeed: dataFeed.entries,
			currentType: type,
			curPageItems: itemsToDisplay,
			curReleaseYear: releaseYear,
		}
	}

	render() {
		var feed = this.state.currentFeed;

		// Filter data
		feed = dataFilter( feed, "programType", this.state.currentType );
		feed = dataFilter( feed, "gtReleaseYear", this.state.curReleaseYear );

		// Sort data
		feed = dataSort( feed, "titleAsc" );

		const titles = feed
			.slice( 0, this.state.curPageItems )
			.map( ( feed, key ) => Program( feed, key ) );

		return (
			<ol className="list programs__list">
				{titles}
			</ol>
		)};
}

/* Render index.html and full list of programs once a programType is selected */
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			programType: 'titles',
		}
	}

	handleClick( type ) {
		var dataLoad = 'loading';

		var fetchResult = FetchData( './feed/sample.json' );

		if ( fetchResult )
			dataLoad = 'loaded';
		else
			dataLoad = null;

		this.setState( {
			programType: type,
			dataLoaded: dataLoad,
			data: fetchResult,
		} )
	}

	render() {
		let option = null;
		// Display filter types if none is selected
		if ( 'titles' === this.state.programType ) {
			option = ( <ol className="list programs__list">
				<FilterTile
					value="movie"
					onClick={() => this.handleClick( "movie" )}
				/>
				<FilterTile
					value="series"
					onClick={() => this.handleClick( "series" )}
				/>
			</ol> );
		} else {
			// Display filtered results if type is selected
			if ( 'loaded' === this.state.dataLoaded ) {
				option = ( <ProgramList
					data={this.state.data}
					value={this.state.programType}
				/> );
				// Display 'loading' message while waiting
			} else  if ( 'loading' === this.state.dataLoaded ) {
				option = ( <ResponseLoading /> );
				// Display error message if issue occurs
			} else {
				option = ( <ResponseBad /> );
			}
		}

		return (
			<article className="programs -index">
				<header className="header -shadow programs__header">
					<h2 className="wrapper -padded heading -index text -light">Popular {this.state.programType}</h2>
				</header>
				<div className="wrapper -padded">
					{option}
				</div>
			</article>
		)
	};
}


/* FUNCTIONS */
/* Return program tiles with image, link and text */
function Program( feed, key ) {
	return ( 
		<li className="programs__entry" key={key}>
			<a className="link -dark -hover-blue" href={'#' + key}>
				<div className="media -size-2x3 -placeholder -fade-in">
					<meta itemProp="image" content={feed.images["Poster Art"].url}/>
					<img alt={feed.title} title={feed.title} src={feed.images["Poster Art"].url} height="200" width="136" className="lazyload"/>
				</div>
				<span>{feed.title}</span>
			</a>
		</li>
	 );
}

/* Return filter tiles to choose programType */
function FilterTile( props ) {
	return ( 
		<li className="programs__entry" id={props.value}>
			<a className="link -dark -hover-blue" href={'#' + props.value} onClick={props.onClick}>
				<div className="media -size-2x3 -placeholder -fade-in">
					<h3>{props.value}</h3>
				</div>
				<span>Popular {props.value}</span>
			</a>
		</li>
	 );
}

/* Return loading message */
function ResponseLoading() {
	return (
		<span>Loading...</span>
	 );
}

/* Return error message */
function ResponseBad() {
	return (
		<span>Oops, something went wrong...</span>
	 );
}

/* Fetch JSON feed of programs */
function FetchData( url ) {
	// For external JSON API
	/*fetch( url )
		.then( function( response ) {
			if ( response.status >= 400 ) {
				return false;
			} else {
				return response.json();
			}
		} )
		.catch ( function ( error ) {
		    console.log( 'Request failed', error );
			return false;
		} );*/

	// For local feed
	return sampleFeed;
}

/* Filter feed of programs */
function dataFilter( data, filter, value ) {
	var dataFilter = data;

	switch( filter ) {
		case "programType":
			dataFilter = ( data.filter( function ( entries ) {
				return entries.programType === value
			} ) );

			break;
		case "gtReleaseYear":
			dataFilter = ( data.filter( function ( entries ) {
				return entries.releaseYear >= value
			} ) );

			break;
		case "ltReleaseYear":
			dataFilter.concat( data.filter( function ( entries ) {
				return entries.releaseYear <= value
			} ) );

			break;
		case "titleByFirstLetter":
			/* TO DO: Filter by first letter of title */
			break;
		default:
			dataFilter = data;
	}

	return dataFilter;
}

/* Sort feed of programs */
function dataSort( data, sort ) {
	var dataSort = [];

	switch( sort ) {
		case "titleAsc":
			dataSort = data.sort( function( a, b ) { if( a.title < b.title ) return -1;  if( a.title > b.title ) return 1; return 0 } );

			break;
		case "titleDesc":
			dataSort = data.sort( function( a, b ) { if( a.title > b.title ) return -1;  if( a.title < b.title ) return 1; return 0 } );

			break;
		case "yearAsc":
			/* TO DO: Sort by year released ascending */

			break;
		case "yearDesc":
			/* TO DO: Sort by year released descending */

			break;
		default:
			dataSort = data;
	}
	return dataSort;
}

export default App;
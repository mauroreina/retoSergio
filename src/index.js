import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import * as serviceWorker from './serviceWorker';

const COUNTRIES_API = "https://restcountries.eu/rest/v2/name/";
const REGION_API = "https://restcountries.eu/rest/v2/region/";
const FILTER_QUERY = "?fields=name;capital;currencies;flag;region;population;languages";

    // FUNCIONES PARA CARGAR LOS DATOS EN LOS TAGs DE REACT
    class Country extends React.Component {
      render() {
        return (
    	    <tr>
            <td><img src={this.props.flag} /></td>
            <td>{this.props.name}</td>
            <td>{this.props.capital}</td>
    		    <td>{this.props.currencies[0].name}</td>
    		    <td>{this.props.region}</td>
            <td>{this.props.population}</td>
          </tr>
        );
      }
    }

    class Continentes extends React.Component {
      render() {
        return (
            <option value={this.props.region}>{this.props.region}</option>
        );
      }
    }


    // FUNCION CONSTRUCTORA
    class SearchCountry extends React.Component {
      constructor(props) {
        super(props);
        this.state = {countries: [], continentes: [], query: "", error: null};
        this.search("j");
      }

      // BUSCA LOS PAISES DE ACUERDO AL INPUT TEXT
      search(query) {
        fetch(COUNTRIES_API + query + FILTER_QUERY)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("No puede encontrar el servicio REST Countries");
            }
          })
          .then(data => this.setState({countries: data, continentes: data, error: null, query: query}))
          .catch(error => this.setState({error: error, countries: [], continentes: [], query: query}));
      }

      // BUSCA TODOS LOS PAISES DE ACUERDO AL CONTINENTE SELECCIONADO
      search_continentes(query) {
        fetch(REGION_API + query + FILTER_QUERY)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("No puede encontrar el servicio REST Countries");
            }
          })
          .then(data => this.setState({countries: data, error: null, query: query}))
          .catch(error => this.setState({error: error, countries: [], query: query}));
      }

      // FUNCION PARA DISPARAR LA BUSQUEDA DE PAISES.
      onChange(e) {
        this.search(e.target.value);
      }

      // FUNCION PARA DISPARA LA BUSQUEDA DE CONTINENTES
      onChange_continentes(c) {
        this.search_continentes(c.target.value);
      }

      // FUNCION QUE PINTA EL HTML
      render() {
        const { error } = this.state;
        let countries = this.state.countries
          .map(c => {
            return (
              <Country
                flag={c.flag}
                name={c.name}
                capital={c.capital}
                currencies={c.currencies}
                region={c.region}
                population={c.population}
              />
            );
          });

          let continentes = this.state.continentes
            .map(s => {
              return (
                <Continentes
                  region={s.region}
                />
              );
            });

        return (

          <div>
              <div className="col-12">
                <h3>Consultar Pais:</h3>
              </div>
            <div className="form-group row">
              <div className="col-12">
                <input type="text" className="form-control" placeholder="Escriba el nombre del pais..." onChange={e => this.onChange(e)}/>
              </div>
              <div className="col-12">
                <h3>Seleccionar Continente:</h3>
              </div>
              <div className="col-12">
                <select name="continente" className="form-control" onChange={c => this.onChange_continentes(c)}>
                <option>--Seleccione continente--</option>
                {continentes}
                </select>
              </div>
            </div>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Bandera</th>
                  <th>Pais</th>
                  <th>Capital</th>
                  <th>Moneda</th>
                  <th>Continente</th>
                  <th>Población</th>
                </tr>
              </thead>
              <tbody>
                {countries}
              </tbody>
            </table>
          </div>
        );
      }
    }


ReactDOM.render(<SearchCountry />, document.getElementById("content"));

serviceWorker.unregister();

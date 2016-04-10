var pok, container;
window.addEventListener('load', function () {
    pok = new PokeApi();
    pok.getList();
    container = document.querySelector('#container');
    container.addEventListener('click', pok.getPock.bind(pok));
});


class PokeApi {
    constructor() {
        this.domane = 'http://pokeapi.co';
        this.urlList = '/api/v1/pokemon/?limit=12';
        this.urlPok = '/api/v1/pokemon/';
        this.loadingEl = document.querySelector('.loading');
        this.button = document.querySelector('button');
        this.button.addEventListener('click', this.getList.bind(this));
        this.pockemons = [];
    };

    getList() {
        this.showLoading();
        const pokemonList = fetch(this._getUrlList())
            .then(response => response.json())
            .then(this._parsListData.bind(this))
            .then(this._hideLoading.bind(this), this._showError.bind(this));

    };

    _disableLoadList() {
        this.button.disabled = true;
    };

    _enabledLoadList() {
        this.button.disabled = false;
    };

    _getUrlList() {
        return this.domane + this.urlList;
    };

    _getUrlPok(id) {
        return this.domane + this.urlPok + id + '/';
    };

    _showError(e) {
        console.log(e);
        alert('Все очень плохо!');

    };

    _hideLoading() {
        this._enabledLoadList();
        this.loadingEl.style.display = 'none';
    }

    showLoading() {
        this._disableLoadList();
        this.loadingEl.style.display = 'block';
    }

    _parsListData(data) {
        if (!data.meta.next) {
            this._disableLoadList();
        }
        this.urlList = data.meta.next;
        let fragment = document.createDocumentFragment();
        this.pockemons.push(data.objects);
        data.objects.forEach(pokemon => {
            let template = document.querySelector('#productrow');
            let clone = document.importNode(template.content, true);

            clone.querySelector('img').src = 'http://pokeapi.co/media/img/' + pokemon.national_id + '.png';
            clone.querySelector('.name').textContent = pokemon.name;
            clone.querySelector('.id').textContent = pokemon.national_id;

            pokemon.types.forEach(type => {
                let div = document.createElement('button');
                div.className = type.name + " " + "btn btn-default";
                div.setAttribute("type", "button");
                div.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
                clone.querySelector('div.abilities').appendChild(div);
            });
            fragment.appendChild(clone);
        });
        document.querySelector('#container').appendChild(fragment);

    }

    getPock(event) {
        var itemId;
        this.showLoading();
        itemId = this._getPokId(event);
        const pokemon = fetch(this._getUrlPok(itemId))
            .then(response => response.json())
            .then(this._parsPokData.bind(this))
            .then(this._hideLoading.bind(this), this._showError.bind(this));

    }

    _parsPokData(data) {

        const fragment = document.createDocumentFragment();
        const template = document.querySelector('#entity');
        const clone = document.importNode(template.content, true);
        clone.querySelector('img').src = 'http://pokeapi.co/media/img/' + data.national_id + '.png';
        clone.querySelector('.name').textContent = data.name;
        clone.querySelector('.attack').textContent = data.attack;
        clone.querySelector('.defence').textContent = data.defense;
        clone.querySelector('.hp').textContent = data.hp;
        clone.querySelector('.sp_atk').textContent = data.sp_atk;
        clone.querySelector('.sp_def').textContent = data.sp_def;
        clone.querySelector('.speed').textContent = data.speed;
        clone.querySelector('.weight').textContent = data.weight;
        clone.querySelector('.moves').textContent = data.moves.length;
        data.types.forEach(type => {
            let span = document.createElement('span');
            span.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1) + " ";
            clone.querySelector('.type').appendChild(span);
        });
        fragment.appendChild(clone);
        let item  = document.querySelector('#item');
        let section = item.querySelector('section');
        if (section !== null){
            item.removeChild(section);
        }
        document.querySelector('#item').appendChild(fragment);
    }

    _getPokId(event) {
        let element;
        if (!(event instanceof Event)) {
            this._showError('Что-то не так, это не событие');
            return;
        }
        element = event.path.filter(item => {
            return item.tagName === 'SECTION'
        });
        if (element === undefined || element[0] === undefined) {
            this._showError('Что-то не так, не можем найти нужный элемент!');
            return;
        }
        return element[0].querySelector('.id').textContent;
    }

}


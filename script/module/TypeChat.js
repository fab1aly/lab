
export class TypeChat extends HTMLElement {

    constructor() {
        super();
        // créer l'élément

    }

    connectedCallback() {
        // le navigateur appelle cette méthode lorsque l'élément est ajouté au document
        // elle peut-être appelé autant de fois que lélément est ajouté ou supprimé)

        this.mode = this.getAttribute('mode') || "word"; //?? maybe tick config ?? 
        this.delay = this.getAttribute('delay') || 1000;  // 1000ms par défaut
        this.tick = this.getAttribute('tick') || 5; // tick => how many frame by tick
        if (this.tick < 1) this.tick = 1;

        this.text = this.innerHTML;
        this.textContent = ``;

        const self = this;
        const text = this.text;

        let index = 0;
        let frame = 0;
        let cache = "";
        let out_of_bracket = true;
        let in_word = true;

        function typeLetter() {
            if (index < text.length) {
                frame++;

                if (frame % self.tick == 0) {


                    cache += text[index++];



                    if (text[index] == "<") {
                        out_of_bracket = false;
                    }
                    if (text[index] == ">") {
                        out_of_bracket = true;
                    }
                    if (out_of_bracket) {
                        self.innerHTML = cache;
                    }

                }
                requestAnimationFrame(typeLetter);// Utilise requestAnimationFrame pour la prochaine lettre
            }
        }


        // don't work !!!

        // function typeWord() {

        //  text.map(word => )
        //     if (index < text.length) {
        //         frame++;

        //         if (frame % self.tick == 0) {

        //             cache += text[index++];



        //             if (text[index] == " ") {

        //                 if (in_word == true) {
        //                     in_word = false;

        //                 }
        //                 else {
        //                     in_word = true;
        //                 }


        //             }


        //             if (text[index] == "<") {
        //                 out_of_bracket = false;
        //             }
        //             if (text[index] == ">") {
        //                 out_of_bracket = true;
        //             }
        //             if (out_of_bracket && in_word === false) {
        //                 self.innerHTML = cache;
        //             }

        //         }
        //         requestAnimationFrame(typeWord);// Utilise requestAnimationFrame pour la prochaine lettre
        //     }
        // }

        // Commence l'effet de frappe après un délai initial
        setTimeout(() => requestAnimationFrame(typeLetter), this.delay);

    }

    disconnectedCallback() {
        // le navigateur appelle cette méthode lorsque l'élément est supprimé du document
        // elle peut-être appelé autant de fois que lélément est ajouté ou supprimé)

        this.textContent = ``;
    }

    // static get observedAttributes() {
    //     return [/* tableau listant les attributs dont les changements sont à surveiller */];
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     // appelé lorsque l'un des attributs listé par la méthode ci-dessus est modifié
    // }

    // adoptedCallback() {
    //     // méthode appelé lorsque l'élément est envoyé vers un nouveau document
    //     // (utilisé très rarement avec document.adoptNode)
    // }

    // vous pouvez ajouter d'autres méthodes ou propriétées
}
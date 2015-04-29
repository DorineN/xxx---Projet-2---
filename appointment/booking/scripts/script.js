// On créer un objet contenant toutes les informations de notre rendez-vous.
var book = {
	branch: undefined, 
	service: undefined, 
	date: undefined, 
	time: undefined, 
    address: undefined,
    siren: undefined,
    spi: undefined,
    raissoc: undefined,
	person: {
		firstName: undefined, 
		lastName: undefined, 
		email: undefined, 
		phone: undefined, 
		mobile: undefined, 
		notes: undefined, 
		civility: undefined,
		type: undefined
	},
	enterprise: {
		spi: undefined,
		siren: undefined,
		title: undefined,
		raissoc: undefined
	}
};

// On créer une variable nous permettant de savoir à quelle étape on se trouve, on l'initialise à 1.
var step = 1;

// On initialise deux paramètres de la fonction ajax puisque ceux-ci seront toujours les mêmes pour toutes les requêtes.
$.ajaxSetup({

    // Toutes nos requêtes pointeront vers le fichier "requests".
    url: "../requests.php",

    // Toutes les requêtes seront du type POST, les variables ne passent donc pas par l'url.
    type: "POST",

    async: false

});

// Cette fonction se lance au chargement complet de la page.
$(document).ready(function() {

    // On créer un tableau avec le nom des div ou il faudra désactiver le clic droit et la sélection du texte.
    var preventDoubleClicTable = ["header", "footer"];

    // On parcourt le tableau.
    for(var i=0; i<preventDoubleClicTable.length; i++) {

        // On désactive le clic droit sur les div choisis au dessus..
        //document.getElementById(preventDoubleClicTable[i]).oncontextmenu = new Function ("return false");

        // On désactive la sélection du texte sur les div choisis au dessus..
        //document.getElementById(preventDoubleClicTable[i]).onselectstart = new Function ("return false");

    }

    // Version du module de rendez-vous.
    var version = "1.1";

    // Titre de l'application.
    //var applicationTitle = "Online Appointment Booking";

    // On écrit le texte du footer incluant la version actuelle du module de rendez-vous.
    $("#footer").html('Copyright © Direction générale des finances publiques - 2014 ');
    //Ancienne valeur : '© 2014 Qmatic France - '+applicationTitle+' v'+version+' - Tous droits réservés'
    
    // On définit le titre de la page.
    //document.title = applicationTitle;

    // On définit le titre de l'application dans le header.
    $("#headerTitle").html("Réservez une salle");
    
    // On initialise le captcha qui servira à valider les informations personnelles à l'étape 5.
    initializeCaptcha();
    
    // On récupère la liste des différents sites.
    if(book.branch == undefined) {

    	getBranches();

    } else {

    	getBranches();

		selectBranch(book.branch);

		getServices();

		$("#lastName").val(book.person.lastName);
		//$("#lastName").attr("disabled", "disabled");

		$("#firstName").val(book.person.firstName);
		//$("#firstName").attr("disabled", "disabled");

		$("#email").val(book.person.email);
		//$("#email").attr("disabled", "disabled");

		$("#mobile").val(book.person.mobile);
		//$("#mobile").attr("disabled", "disabled");

		$("#branch").val(book.branch.name);
		$("#branch").attr("disabled", "disabled");

        $("#address").val(book.branch.addressLine1);
        //$("#branch").attr("disabled", "disabled");

         $("#ville").val(book.branch.addressCity);
        //$("#branch").attr("disabled", "disabled");

         $("#cp").val(book.branch.addressZip);
        //$("#branch").attr("disabled", "disabled");

		$("#phone").val(book.person.phone);
		//$("#phone").attr("disabled", "disabled");

		$("#spi").val(book.enterprise.spi);
		//$("#spi").attr("disabled", "disabled");

		//$("#civility").val(book.person.civility);
		$('#civility').prop('selectedIndex', book.person.civility);
		//$("#civility").attr("disabled", "disabled");
		
		$('#phone').prop('selectedIndex', book.person.phone);

		if(book.person.type == "part") {

			$(".groupPro").hide();
			
			$("#raissoc").hide();
			
			$("#siren").hide();

		} else if(book.person.type == "pro") {

            $(".codespi").hide();
			
			$("#raissoc").val(book.enterprise.raissoc);
			//$("#raissoc").attr("disabled", "disabled");

			$("#siren").val(book.enterprise.siren);
			//$("#siren").attr("disabled", "disabled");
			
			$("#spi").hide;
			//$("#siren").attr("disabled", "disabled");

		}


    }


    // Ce bout de code permet de n'autoriser que les numéros dans le champ "Numéro de téléphone".
    $("#phone").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

});

// On récupère les différents sites ainsi que le nombre de personnes en attente.
function getBranches() {

    // On affiche le contenu.
    $("#content").fadeIn("slow");

    // On créer un tableau qui contiendra la liste des sites.
    branches = new Array();

    // On interroge l'API.
    $.ajax({

        // On envoi des données lors de notre requêtes.
        data: {type: "branches", request: "book"},

        // Si la requête a correctement aboutie.
        success: function(result) {

            // On décrypte et retranforme au format JSON le résultat de notre requête.
            result = $.parseJSON(window.atob(result));

            // On parcourt la liste des résultats.
            for(var i=0, j=0; i<result.branchList.length; i++) {

                // Si un paramètre "qpId" est manquant.
                if(result.branchList[i].qpId == null) {

                    // On affiche une alerte.
                    displayAlert("Le site « "+result.branchList[i].name+" » a mal été configuré, le paramètre qpId est manquant", 5000);

                // Si le site est correctement configuré.
                } else {

                    // On complète notre tableau.
                    branches[i] = result.branchList[i];

                }

            }

            // Si les données ont correctement été chargées, on affiche le module de prise de rendez-vous.
            if(branches != undefined && branches.length > 0) {

                // On masque l'image de chargement.
                $("#branchesList").html("");

                // On parcourt la liste des sites.
                for(var i=0; i<branches.length; i++) {
                    
                    // On ajoute tous les sites à notre module de prise de rendez-vous.
                    $("#branchesList").append('<div class="col-sm-6 col-md-4"><div class="thumbnail" value="branch" id="'+branches[i].publicId+'" onclick="selectBranch(this.id)"><div class="caption" style="text-align:center; margin-top:-10px;"><h3>'+branches[i].name.replace(/â/g, "'")+'</h3></div></div></div>');

                }

            } else if(branches.length == 0) {

                // On masque les boutons "Suivant" et "Retour".
                $("#navigationButtons").hide();

                // On affiche une alerte.
                displayAlert("Il n'y a aucun site de disponible.", 60000);

            }

        },

        // Si la requête n'a pas aboutie.
        error: function() {

            // On masque les boutons "Suivant" et "Retour".
            $("#navigationButtons").hide();

            // On affiche une alerte.
            displayAlert("Erreur lors de la récupèration des données.", 60000);

        }

    });

}

// Cette fonction permet de sélectionner un site.
function selectBranch(publicId) {

    // On parcourt l'ensemble des sites.
    for(var i=0; i<branches.length; i++) {

        // Si l'identifiant public correspond à celui selectionnée actuellement.
        if(branches[i].publicId == publicId) {

            // On conserve les informations du site sélectionné.
            book.branch = branches[i];

            book.branch.name = book.branch.name.replace(/â/g, "'").replace(/Ã/g, "É");

            // On écrit le service sélectionné dans le titre du tableau.
            $("#reminderService").html("Vous avez sélectionné le service : "+book.branch.name);

            $("#reminderService").show();

        }

    }

    // On parcourt l'ensemble des sites
    $('div[value^="branch"]').each(function(){

        // On attribut le style de base aux sites.
        $(this).attr("class", "thumbnail");

    });

    // On attribut le style de sélection sur le site sélectionné.
    $("#"+publicId).attr("class", "thumbnail selected");

}

// On récupère les différents services.
function getServices() {

    // On créer un tableau qui contiendra la liste des services.
    services = new Array();

    // On interroge l'API.
    $.ajax({

        data: {type: "services", request: "book", branchId: book.branch.id},

        // Si la requête a correctement aboutie.
        success: function(result) {

            // On décrypte et retranforme au format JSON le résultat de notre requête.
            result = $.parseJSON(window.atob(result));

            // On parcourt la liste des résultats pour chaque profil de rendez-vous
            for(var i=0, j=0; i<result.appointmentprofileList[0].services.length; i++) {

                // Si le service est activé, on le conserve.
                if(result.appointmentprofileList[0].services[i].active == true && result.appointmentprofileList[0].services[i].publicEnabled == true) {

                    // S'il s'agit d'un particulier qui désire accèder à un SIE.
                    if(book.person.type == "part" && book.branch.name.indexOf("SERVICE IMPOTS DES ENTREPRISES") >= 0) {

                        if(result.appointmentprofileList[0].services[i].name == "Une demande de quitus (certificat d'acquisition intracommunautaire de vÃ©hicule)" || result.appointmentprofileList[0].services[i].name == "Autres renseignements") {

                            // On complète notre tableau.
                            services[j] = result.appointmentprofileList[0].services[i];

                            services[j].name = services[j].name.replace(/Ã©/g, "é");

                            j++;

                        }

                    } else {

                        // On complète notre tableau.
                        services[j] = result.appointmentprofileList[0].services[i];

                        services[j].name = services[j].name.replace(/Ã´/g, "ô").replace(/Ã©/g, "é").replace(/Ã¨/g, "è").replace(/Ã§/g, "ç").replace(/Ã/g, "à").replace(/\s+/g," ");

                        j++;

                    }

                }

            }

            // Si les données ont correctement été chargées, on affiche le module de prise de rendez-vous.
            if(services != undefined && services.length > 0) {

                // On passe à l'étape suivante.
                goToTheNextStep();

                // On vide la liste des services.
                $("#servicesList").html("");

                // On parcourt la liste des sites.
                for(var i=0; i<services.length; i++) {
                    
                    // On ajoute tous les sites à notre module de prise de rendez-vous.
                    $("#servicesList").append('<div class="col-sm-6 col-md-4"><div class="thumbnail" value="service" id="'+services[i].publicId+'" onclick="selectService(this.id);nextStep()"><div class="caption" style="text-align:center;height:100px;line-height:90px;overflow:hidden;margin-right:2px;"><span style="vertical-align:middle;display:inline-block;line-height:normal;">'+services[i].name+'</span></div></div></div>');

                }

            } else if(services.length == 0) {

                // On affiche une alerte.
                displayAlert("Il n'y a aucun service de disponible pour ce site.", 5000);

            }

        },

        // Si la requête n'a pas aboutie.
        error: function() {

            // On affiche une alerte.
            displayAlert("Erreur lors de la récupèration des données.", 60000);

        }

    });

}

// Cette fonction permet de sélectionner un service.
function selectService(publicId) {

    // On parcourt l'ensemble des services.
    for(var i=0; i<services.length; i++) {

        // Si l'identifiant public correspond à celui selectionnée actuellement.
        if(services[i].publicId == publicId) {

            // On conserve les informations du service sélectionné.
            book.service = services[i];

        }

    }

    // On parcourt l'ensemble des sites
    $('div[value^="service"]').each(function(){

        // On attribut le style de base aux sites.
        $(this).attr("class", "thumbnail");

    });

    // On attribut le style de sélection sur le site sélectionné.
    $("#"+publicId).attr("class", "thumbnail selected");

}

// On récupère les dates disponibles.
function getDates() {

    // On créer un tableau qui contiendra la liste des services.
    dates = new Array();

    // On interroge l'API.
    $.ajax({

        data: {type: "dates", request: "book", branchPublicId: book.branch.publicId, servicePublicId: book.service.publicId},

        // Si la requête a correctement aboutie.
        success: function(result) {

            // On décrypte et retranforme au format JSON le résultat de notre requête.
            result = $.parseJSON(window.atob(result));

            // On parcourt la liste des résultats.
            for(var i=0; i<result.dates.length; i++) {
                    
                // On complète notre tableau.
                dates[i] = result.dates[i].substr(0, 10);

            }

            // Si les données ont correctement étés récupérées et qu'il reste des plages horaires de disponibles.
            if(dates != undefined && dates.length > 0) {

                // On passe à l'étape suivante.
                goToTheNextStep();

                // On initialise le calendrier.
                initializeDatepicker();

            // Si il ne reste plus de plages horaires disponibles pour le service sélectionné.
            } else if(dates.length == 0) {

                // On affiche une alerte.
                displayAlert("Il n'y a plus de plages horaires disponibles pour le service sélectionné.", 5000);

            }

        },

        // Si la requête n'a pas aboutie.
        error: function() {

            // On affiche une alerte.
            displayAlert("Erreur lors de la récupèration des données.", 5000);

        }

    });

}

// Cette fonction permet de sélectionner une date.
function selectDate(date) {

    book.date  = date.substr(6, 4)+"-"+date.substr(0, 2)+"-"+date.substr(3, 2);

}

// On récupère les heures disponibles.
function getTimes() {

    // On créer un tableau qui contiendra la liste des services.
    times = new Array();

    // On interroge l'API.
    $.ajax({

        data: {type: "times", request: "book", branchPublicId: book.branch.publicId, servicePublicId: book.service.publicId, date: book.date},

        // Si la requête a correctement aboutie.
        success: function(result) {

            // On décrypte et retranforme au format JSON le résultat de notre requête.
            result = $.parseJSON(window.atob(result));

            // On complète notre variable.
            times = result.times;

            // Si les données ont correctement été chargées, on affiche le module de prise de rendez-vous.
            if(times != undefined && times.length > 0) {

                // On passe à l'étape suivante.
                //goToTheNextStep();

                // On vide la liste des services.
                $("#timeList").html("");

                // On parcourt la liste des sites.
                for(var i=0; i<times.length; i++) {
                    
                    // On ajoute tous les sites à notre module de prise de rendez-vous.
                    $("#timeList").append('<div class="col-md-2"><div class="thumbnail" value="time" id="'+times[i].replace(":", "")+'" onclick="selectTime(this.id);nextStep()"><div class="caption" style="text-align:center; padding:0px;">'+times[i]+'</div></div></div>');

                }

            // Si il n'y a plus de plages horaires disponibles pour le service sélectionné.
            } else if(times.length == 0) {

                // On affiche une alerte.
                displayAlert("Il n'y a plus de plages horaires disponibles pour le service sélectionné.", 5000);

            }

        },

        // Si la requête n'a pas aboutie.
        error: function() {

            // On affiche une alerte.
            displayAlert("Erreur lors de la récupèration des données.", 5000);

        }

    });

}

// Cette fonction permet de sélectionner un service.
function selectTime(time) {

    // On conserve les informations du service sélectionné.
    book.time = time.substr(0, 2)+":"+time.substr(2, 2);

    // On parcourt l'ensemble des sites
    $('div[value^="time"]').each(function(){

        // On attribut le style de base aux sites.
        $(this).attr("class", "thumbnail");

    });

    // On attribut le style de sélection sur le site sélectionné.
    $("#"+time).attr("class", "thumbnail selected");

}

// Cette fonction permet de passer à l'étape suivante.
function goToTheNextStep() {

    $("#contentAlert").hide();

    if(step !== 3) {
    $("#step"+step).fadeOut(400);
    }

    if(step == 4) {
        $("#step3").fadeOut(400);
        $("#nextButton").fadeIn(400);
    }

    setTimeout(function(){

        $("#step"+(step+1)).fadeIn(400);

        step++;

    }, 400);

};

var temporaryBranchPublicId = 0;
var temporaryServicePublicId = 0;
var temporaryDate = 0;
var temporaryTime = 0;
var temporaryCaptchaCode = false;
var emailSent = 0;
var validationStateCaptchaCode;

// Cette fonction permet de valider le passage à l'étape suivante.
function nextStep() {

    document.getElementById('content').scrollTop = '0px';

    if(step == 7) {

        // On affiche un message d'alerte.
        displayAlert("Vous êtes déjà à la dernière étape du rendez-vous.", 5000);

    } else {

        if(step == 1) {

            // Si aucun site n'a été sélectionné.
            if(book.branch == undefined) {

                // On affiche une alerte.
                displayAlert("Vous devez sélectionner un site avant de continuer.", 5000);

            } else if(book.branch.publicId !== temporaryBranchPublicId) {

                // On récupère la liste des différents services.
                validateServices = getServices();

                // On sauvegarde l'identifiant publique du site sélectionné.
                temporaryBranchPublicId = book.branch.publicId;

            } else {

                // On passe à l'étape suivante.
                goToTheNextStep();

            }

        } else if(step == 2) {

            if(book.service == undefined) {

                displayAlert("Vous devez sélectionner un service avant de continuer.", 5000);

            } else if(book.branch.publicId !== temporaryBranchPublicId || book.service.publicId !== temporaryServicePublicId) {

                // On récupère la liste des différents services.
                validateDates = getDates();

                temporaryServicePublicId = book.service.publicId; goToTheNextStep();

            } else {

                // On passe à l'étape suivante.
                goToTheNextStep();

            }

        } else if(step == 3) {

            if(book.date == undefined) {

                displayAlert("Vous devez sélectionner une date avant de continuer.", 5000);

            } else if(book.branch.publicId !== temporaryBranchPublicId || book.service.publicId !== temporaryServicePublicId || book.date !== temporaryDate) {

                // On récupère la liste des différents créneaux horaires.
                validateTimes = getTimes();

                temporaryDate = book.date;

            } else {

                // On passe à l'étape suivante.
                goToTheNextStep();

            }

        } else if(step == 4) {

            if(book.time == undefined) {

                displayAlert("Vous devez sélectionner une heure avant de continuer.", 5000);

            } else if(book.branch.publicId !== temporaryBranchPublicId || book.service.publicId !== temporaryServicePublicId || book.date !== temporaryDate || book.time !== temporaryTime) {

            	$("#service").val(book.service.name);
				$("#service").attr("disabled", "disabled");

                // On passe à l'étape suivante.
                goToTheNextStep();

            } else {

                $("#service").val(book.service);
				$("#service").attr("disabled", "disabled");

                // On passe à l'étape suivante.
                goToTheNextStep();

            }

        } else if(step == 5) {

            if(validationStateCaptchaCode !== "trueCode") {

                // On récupère la valeur de l'état de validation du code.
                validationStateCaptchaCode = validateCaptcha($("#captcha_code").val());

            }

            // On créer un tableau qui contiendra la liste des erreurs lors de la validation du formulaire.
            var listOfErrors = new Array();

            // Si le champ civilité n'est pas indiqué.
            if($("#civility").val() == undefined || $("#civility").val() == "") {

                // On retourne un message d'erreur à l'usager.
                listOfErrors.push("Vous devez renseigner le champ civilité.");

            }

            // Si le champ nom n'est pas indiqué.
            if($("#firstName").val() == undefined || $("#firstName").val() == "") {

                // On retourne un message d'erreur à l'usager.
                listOfErrors.push("Vous devez renseigner votre prénom.");

            }

            // Si le champ nom n'est pas indiqué.
            if($("#lastName").val() == undefined || $("#lastName").val() == "") {

                // On retourne un message d'erreur à l'usager.
                listOfErrors.push("Vous devez renseigner votre nom.");

            }

            // Si les champs email, téléphone fixe ET téléphone mobile ne sont pas indiqués.
            if(($("#email").val() == undefined || $("#email").val() == "") && ($("#phone").val() == undefined || $("#phone").val() == "") && ($("#mobile").val() == undefined || $("#mobile").val() == "")) {

                // On retourne un message d'erreur à l'usager.
                listOfErrors.push("Afin de mieux traiter votre demande, vous devez renseigner votre adresse électronique et/ou votre numéro de téléphone mobile et/ou votre numéro de téléphone fixe.");

            }

            // S'il s'agit d'un professionnel.
            if(book.person.type == "pro") {

                // Si le champ SIREN n'est pas indiqué.
                if($("#siren").val() == undefined || $("#siren").val() == "") {

                    // On retourne un message d'erreur à l'usager.
                    listOfErrors.push("Vous devez renseigner le champ SIREN.");

                }

                // Si le champ nom n'est pas indiqué.
                if($("#raissoc").val() == undefined || $("#raissoc").val() == "") {

                    // On retourne un message d'erreur à l'usager.
                    listOfErrors.push("Vous devez renseigner le champ raison sociale.");

                }

            }

            // Si la syntaxe de l'adresse email est incorrecte.
            if(($("#email").val() == undefined || $("#email").val() == "") && !checkMail($("#email").val())) {

                // On retourne un message d'erreur à l'usager.
                listOfErrors.push("La syntaxe de l'adresse email est incorrecte.");

            }

            // Si la syntaxe de l'adresse email est incorrecte.
            if($("#notes").val() == undefined || $("#notes").val() == "") {

                // On retourne un message d'erreur à l'usager.
                listOfErrors.push("Vous devez préciser le motif de votre rendez-vous.");

            }

            // Si le captcha n'est pas complèté.
            if(validationStateCaptchaCode == "unknown" && !temporaryCaptchaCode) {

                listOfErrors.push("Le code de sécurité est incorrect.");

                initializeCaptcha();

                $("#captcha_code").val('');
            }

            // Si le captcha est incorrect.
            if(validationStateCaptchaCode == "falseCode" && !temporaryCaptchaCode) {

                 listOfErrors.push("Le code de sécurité est incorrect.");

                initializeCaptcha();

                $("#captcha_code").val('');

            }

            if(listOfErrors.length > 1) {

                var messageOfError = "La page comporte plusieurs erreurs :<br><ul>";

                for(var i=0; i < listOfErrors.length; i++) {

                    messageOfError += "<li>" + listOfErrors[i] + "</li>";

                }

                messageOfError += "</ul>";

                displayAlert(messageOfError, 20000);

            } else if(listOfErrors.length == 1) {

                 displayAlert(listOfErrors[0], 10000);

            }

            // Si tout est bon.
            if(validationStateCaptchaCode == "trueCode" && listOfErrors.length == 0) {

                // On passe à l'étape suivante.
                goToTheNextStep();

                // On indique au système qu'il n'est plus nécessaire de valider le captcha.
                temporaryCaptchaCode = true;

                // On désactiver le champ ou l'on devait entrer le code du captcha.
                $("#captcha_code").prop('disabled', true);

                // On enregistre les informations personnelles.
                book.person.firstName = $("#firstName").val().charAt(0).toUpperCase() + $("#firstName").val().substring(1).toLowerCase();;
                book.person.lastName = $("#lastName").val().toUpperCase();
                book.person.email = $("#email").val().toLowerCase();
				book.person.phone = $("#phone").val();
                book.person.mobile = $("#mobile").val();
                book.person.notes = $("#notes").val();

                book.enterprise.spi = $("#spi").val();
                book.enterprise.siren = $("#siren").val();
                book.enterprise.raissoc = $("#raissoc").val();

                $("#validationBranch").html(book.branch.name);
                $("#validationService").html(book.service.name);
                $("#validationDate").html(book.date.substr(8, 2)+"/"+book.date.substr(5, 2)+"/"+book.date.substr(0, 4));
                $("#validationTime").html((book.time).replace(":", "h"));
                $("#validationLastName").html(book.person.lastName);
                $("#validationFirstName").html(book.person.firstName);
                $("#validationEmail").html(book.person.email);
                $("#validationPhone").html(book.person.phone);
				$("#validationMobile").html(book.person.mobile);
                $("#validationNotes").html(book.person.notes);
                $("#validationRaissoc").html(book.enterprise.raissoc);
                $("#validationSiren").html(book.enterprise.siren);
                $("#validationSpi").html(book.enterprise.spi);
                $("#validationAddress").html(book.branch.addressLine1);
                $("#validationVille").html(book.branch.addressCity);
                $("#validationCodePostal").html(book.branch.addressZip);

                if(book.branch.name.indexOf("SERVICE IMPOTS DES ENTREPRISES") >= 0) {

	                if(book.service.name == "Le paiement d'un impôt") {

	                	$("#validationPiecesJustificatives").html("Si, lors de votre rendez-vous, vous souhaitez faire état de difficultés de paiement, merci d'apporter tous les documents que vous jugerez utiles ");
                        $("#validationPiecesJustificatives").append("pour l’examen de votre demande.");

	                } else if(book.service.name == "La création, la cession ou la cessation d'une activité") {

	                	$("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents que vous jugerez utiles pour l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur la création, la cession ou la cessation d'une activité.");

	                } else if(book.service.name == "Le Régime des auto-entrepreneurs/des SCI/ des associations") {
													
	                	$("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur le régime des auto-entrepreneurs/des SCI/des associations. Exemple : statuts pour les associations.");

	                } else if(book.service.name == "Une demande de quitus") {

	                	$("#validationPiecesJustificatives").html("Lors de votre rendez-vous, vous devez apporter tous les documents nécessaires à l'examen de votre demande de quitus :<br><br>");
                        $("#validationPiecesJustificatives").append("<ul><li>Original et copie de la facture ou de l'acte de vente (formulaire cerfa n° 13754*02), accompagné d'une traduction effectuée par un traducteur agréé si le document est en langue étrangère,</li></ul>");
                        $("#validationPiecesJustificatives").append("<ul><li>Certificat d'immatriculation à l'étranger si le véhicule est déjà immatriculé,</li></ul>");
                        $("#validationPiecesJustificatives").append("<ul><li>Une pièce d'identité (extrait K bis pour les sociétés)et un justificatif de domicile. Plus de détails sur ces justificatifs, en cliquant sur le lien ci-dessous : (http://vosdroits.service-public.fr/particuliers/F31853.xhtml), </li></ul>");

	                } else if(book.service.name == "Les impôts d'Etat (IS/BIC/BNC/BA/TVA)") {

	                    $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur les impôts d'Etat (IS/BIC/BNC/BA/TVA).");

	                } else if(book.service.name == "Les impôts locaux (CFE/CVAE/IFER)") {

	                    $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur les impôts locaux (CFE/CVAE/IFER).");

                    } else if(book.service.name == "Autres renseignements") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande. ");
                        $("#validationPiecesJustificatives").append("Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ");
                        $("#validationPiecesJustificatives").append("Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.");

                    }

                    // BLOC SIE

	            } else if(book.branch.name.indexOf("SERVICE IMPOTS PARTICULIERS") >= 0) {

					if(book.service.name == "Le paiement d'un impôt") {

	                	$("#validationPiecesJustificatives").html("Si lors de votre rendez-vous, vous souhaitez faire état de difficultés de paiement, merci d'apporter tous les documents utiles ");
                        $("#validationPiecesJustificatives").append("à l'examen de votre demande, notamment pour justifier du montant de vos revenus (bulletins de salaires des 3 derniers mois,...) et de vos charges (loyers, emprunt(s)...).");

	                } else if(book.service.name == "Les changements de situation familiale") {

	                	$("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur les changements de situation familiale. Exemple : livret de famille, acte de mariage, jugement de divorce...");

	                } else if(book.service.name == "Première déclaration de revenus") {

	                	$("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur votre première déclaration de revenus : pièces d'identité, bulletin de salaire, justificatif de domicile ");
                        $("#validationPiecesJustificatives").append("(copie d'un contrat de location ou attestation d'hébergement accompagnée du contrat de location de la personne qui vous héberge).");

                    } else if(book.service.name == "Les investissements locatifs et les revenus fonciers") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur les investissements locatifs et les revenus fonciers. Exemple : acte d'achat, contrat de bail, justificatifs de charges, engagement de location.");

                    } else if(book.service.name == "Les revenus perçus à l'étranger") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur les revenus perçus à l'étranger. Exemple : justificatif de l’encaissement des sommes, tout document ");
                        $("#validationPiecesJustificatives").append("justifiant de la nature des revenus (bulletin de salaire, quittance de loyer), justificatif éventuel du paiement de l’impôt à l’étranger.");

                    } else if(book.service.name == "L'impôt sur le revenu") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur l'impôt sur le revenu.");

                    } else if(book.service.name == "La taxe d'habitation, la contribution audiovisuelle publique, la taxe sur les logements vacants") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen de votre demande ");
                        $("#validationPiecesJustificatives").append("portant sur la taxe d'habitation, la contribution audiovisuelle publique (redevance TV) ou la taxe sur les logements vacants. ");
                        $("#validationPiecesJustificatives").append("Exemple : justificatif de domicile au 1er janvier, état des lieux d’entrée, état des lieux de sortie, copie du bail...");

                    } else if(book.service.name == "La taxe foncière") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen de votre demande ");
                        $("#validationPiecesJustificatives").append("portant sur la taxe foncière. Exemple : acte d’achat, plans et métrages précis de l’habitation, résiliation du bail...");

                    } else if(book.service.name == "Autres renseignements") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen de votre demande. ");
                        $("#validationPiecesJustificatives").append("Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ");
                        $("#validationPiecesJustificatives").append("Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.");

	                }

                //BLOC TRESORERIE

                } else if(book.branch.name.indexOf("TRESORERIE") >= 0) {

                    if(book.service.name == "Le paiement d'un impôt") {

                        $("#validationPiecesJustificatives").html("Si lors de votre rendez-vous, vous souhaitez faire état de difficultés de paiement, merci d'apporter tous les documents utiles ");
                        $("#validationPiecesJustificatives").append("à l'examen de votre demande, notamment pour justifier du montant de vos revenus (bulletins de salaires des 3 derniers mois,...) et de vos charges (loyers, emprunt(s)...).<br><br>");

                    } else if(book.service.name == "Autres renseignements") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront vous être utiles à l'examen de votre demande. ");
                        $("#validationPiecesJustificatives").append("Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ");
                        $("#validationPiecesJustificatives").append("Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.<br />");

                    }

                    // BLOC FONCIER

                 } else if(book.branch.name.indexOf("FONCIER") >= 0) {

                    if(book.service.name == "La souscription d'une déclaration pour la taxe foncière") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas de vous munir de tous les documents dont vous disposez à propos de ce bien : ");
                        $("#validationPiecesJustificatives").append("acte notarié, baux, états des lieux, mesurages des surfaces, photographies intérieures et/ou extérieures permettant d'en apprécier la consistance et l'état,...<br />");

                    } else if(book.service.name == "Une réclamation sur le montant de la taxe foncière") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ");
                        $("#validationPiecesJustificatives").append("de votre demande portant sur la réclamation sur le montant de la taxe foncière. ");
                        $("#validationPiecesJustificatives").append("(exemple pour un immeuble restant innocupé pouvant bénéficier d'une exonération : bail de sortie, bail entrant, justificatifs de recherche de locataires...).<br><br>");

                    } else if(book.service.name == "Autres renseignements") {

                        $("#validationPiecesJustificatives").html("Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen de votre demande. ");
                        $("#validationPiecesJustificatives").append("Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ");
                        $("#validationPiecesJustificatives").append("Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.<br />");

                    }

                }

            }

        } else if(step == 6) {

            if(emailSent == 0) {

                getBook();

            } else {

                displayAlert("Vous avez déjà validé votre rendez-vous", 5000);

                goToTheNextStep();

            }

        }

        

    }

}

var timeout = 0;

// Cette fonction permet d'afficher une alerte.
function displayAlert(text, timer) {

    $("#contentAlert").html(text);

    if(timeout == 0) {

        $("#contentAlert").slideDown();
    
        // On ferme l'avertissement après l'avoir afficher XX secondes.
        timeout = setTimeout(function() {

            $("#contentAlert").slideUp();

            if(timer > 30000) {

                location.reload();
            }

            timeout = 0;

        }, timer);

    }

}

function checkMail(mail) {

	if(mail) {

	    var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
	    
	    if(reg.test(mail)) {

	        return(true);
	    
	    } else {
	        
	        return(false);
	                
	    }

	} else {

		return(true);
		
	}

};

var initializationDatepickerSelectedDay = false;

function initializeDatepicker() {

    jQuery.datepicker.setDefaults(jQuery.datepicker.regional['fr']);

    $("#dateList").datepicker({
        firstDay : 1,
        minDate: new Date(parseInt(dates[0].substr(0, 4)), parseInt(dates[0].substr(5, 2))-1, parseInt(dates[0].substr(8, 2))),
        maxDate: new Date(parseInt(dates[dates.length-1].substr(0, 4)), parseInt(dates[dates.length-1].substr(5, 2))-1, parseInt(dates[dates.length-1].substr(8, 2))),
        hideIfNoPrevNext: false,

        onSelect: function(date) {selectDate(date); getTimes();},
        beforeShowDay: function(date) {

            var date2 = jQuery.datepicker.formatDate('yy-mm-dd', date);

            if($.inArray(date2, dates) == -1) {

                return [false, "", "Aucun rendez-vous disponible à cette date"]; 

            } else if($.inArray(date2, dates) !== -1) {

                if(!initializationDatepickerSelectedDay) {

                    book.date = date2;

                    getTimes();

                    initializationDatepickerSelectedDay = true;

                };

                return [true, "", ""]; 

            }

            // else if($.inArray(date2, dates) !== -1) {

            //     var numberOfAppointmentsAvailable = getTimes(book.branch.publicId, book.service.publicId, date2).length;

            //     if(numberOfAppointmentsAvailable == 0){

            //         return [false, "", "Aucun rendez-vous disponible à cette date"]; 

            //     } else if(numberOfAppointmentsAvailable == 1){

            //         return [true, "", "1 rendez-vous disponible"]; // RED

            //     } else if(numberOfAppointmentsAvailable > 1 && numberOfAppointmentsAvailable < 5){

            //         return [true, "", numberOfAppointmentsAvailable+" rendez-vous disponibles"]; // ORANGE

            //     } else if(numberOfAppointmentsAvailable > 5){

            //         return [true, "", numberOfAppointmentsAvailable+" rendez-vous disponibles"]; // GREEN

            //     }

            // }
            
        }

    });


    var width = document.body.clientWidth || window.innerWidth;

    if(width < 500) {

        $("#dateList").datepicker( "option", "dayNamesMin", ["Di","Lu","Ma","Me","Je","Ve","Sa"]);


    } else {

        $("#dateList").datepicker( "option", "dayNamesMin", ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]);

    }


}

// Cette fonction permet de valider le passage à l'étape précédente.
function previousStep() {

    document.getElementById('content').scrollTop = '0px';
    
    // Si l'on se trouve à la première étape.
    if(step == 2) {

        // On affiche un message d'alerte.
        //displayAlert("Vous êtes déjà à la page de démarrage.", 5000);

        var answer = confirm ("Confirmez vous la fermeture de cette page pour retourner à la sélection du service ?");

        if(answer) {

            document.location.href=("http://www.impots.gouv.fr");

        }

    // Sinon, on revient à l'étape précédente.
    } else {

    $("#contentAlert").hide();

    $("#step"+step).fadeOut(400);
    
    if(step == 4) {

        $("#step"+(step-1)).fadeOut(400);

    }

    setTimeout(function(){

        if(step == 5) {

            $("#step"+(step-1)).fadeIn(400);
            $("#step"+(step-2)).fadeIn(400);
            $("#nextButton").fadeOut(400);

        } else if(step == 4) {

            $("#step"+(step-2)).fadeIn(400);
            step--;

        } else {
        
            $("#step"+(step-1)).fadeIn(400);

        }

        step--;

    }, 400);

    }

}

// On enregistre le rendez-vous dans le système.
function getBook() {

    var parameterObject = {

        "title": "Rendez-vous",
        "notes": book.person.notes,
        "customer": {"firstName":book.person.firstName,"lastName":book.person.lastName,"email":book.person.email,"phone":book.person.phone}

      };

    var customer = JSON.stringify(parameterObject);

    // On interroge l'API.
    $.ajax({

        // On envoi les informations inscrites dans le formulaire de prise de rendez-vous.
        data: {type: "book", request: "book", branchPublicId: book.branch.publicId, servicePublicId: book.service.publicId, date: book.date, time: book.time, person: customer},

        // Si la requête a correctement aboutie.
        success: function(result) {

            var publicId = JSON.parse(window.atob(result)).publicId;

            // On interroge l'API.
            $.ajax({

                // On envoi les informations inscrites dans le formulaire de prise de rendez-vous.
                data: {type: "publicId", request: "book"},

                // Si la requête a correctement aboutie.
                success: function(result) {

                    goToTheNextStep();

                    $("#navigationButtons").hide();

                    $("#appointmentSuccess").html('<p>Votre code est le suivant :</p><p><h1 id="appointmentId" style="margin-bottom:20px; font-size:100px; font-weight:bold;"></h1></p>');


                    if(book.person.email) {

                        $("#appointmentSuccess").append('<p>Un e-mail provenant de ne-pas-repondre@rendezvousqmatic.fr,</p><p> résumant les informations de votre rendez-vous vous a été envoyé.</p>');

                    } else {

                        $("#appointmentSuccess").append('<p>Merci de noter les références de votre rendez-vous</p>');

                    }

                    result = JSON.parse(window.atob(result));

                    // On parcourt la liste des résultats.
                    for(var i=0; i<result.appointmentList.length; i++) {

                        // Si le service est activé, on le conserve.
                        if(result.appointmentList[i].publicId == publicId) {
                            
                            // On affiche le numéro du rendez-vous.
                            $("#appointmentId").html(result.appointmentList[i].id);

                            sendEmail(result.appointmentList[i].id);

                        }

                    }

                },

                // Si la requête n'a pas aboutie.
                error: function() {

                    // On affiche une alerte.
                    displayAlert("Erreur lors de l'enregistrement du rendez-vous.", 5000);

                }

            });

        },

        // Si la requête n'a pas aboutie.
        error: function() {

            // On affiche une alerte.
            displayAlert("Erreur lors de l'enregistrement du rendez-vous.", 5000);

        }

    });

}

// Cette fonction permet de calculer la différence entre deux dates.
function dateDifference(date1, date2) {

    var diff = {};                          // Initialisation du retour
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diffInSec = tmp % 60;                    // Extraction du nombre de secondes
 
    tmp = Math.floor((tmp-diffInSec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;
     
    return diff;

};

// On récupère les heures disponibles.
function initializeCaptcha() {

    if(validationStateCaptchaCode !== "trueCode") {

        // On interroge l'API.
        $.ajax({

            data: {type: "initialization", request: "captcha"},

            // Si la requête a correctement aboutie.
            success: function(result) { 

                $("#captcha").html(window.atob(result));

                $("#captcha_code").val();

            }

        });

    }

};


// On récupère les variables passées en méthode POST.
function recoverPostVariables(branch, personType, civility, lastname, firstname, phone, mobile, mail, spi, siren, title, raissoc) {

    if(branch == undefined || personType.length == 0) {

        // On affiche un message d'alerte.
        displayAlert("Erreur lors de la réception des données personnelles, veuillez réessayer.", 60000);

        $("#navigationButtons").hide();

    } else {

        if(branch == 1000350) {

            book.branch = "010035";

        } else if(branch == 9400751) {

            book.branch = "094015";

        } else if(branch == 9400151) {
            
            book.branch = "094039";

        } else {

            book.branch = branch;

        }

        // if(branch == 1000300 || branch == 1000301 || branch == 9400101 || branch == 9400701) {

        //     book.person.personType = "pro";

        // } else {

        //     book.person.personType = "part";

        // }

        book.person.type = personType;

    	if(civility == 0) {

    		book.person.civility = "Mr";

    	} else if(civility == 1) {

    		book.person.civility = "Mme";

    	} else if (civility == 2) {

    		book.person.civility = "Mlle";

    	}

    	book.person.lastName = lastname;
    	book.person.firstName = firstname;
    	book.person.phone = phone;
    	book.person.mobile = mobile;
    	book.person.email = mail;
    	book.enterprise.spi = spi;
    	book.enterprise.siren = siren;
    	book.enterprise.title = title;
    	book.enterprise.raissoc = raissoc;

    }

};


// On récupère les heures disponibles.
function validateCaptcha(code) {

    // On interroge l'API.
    $.ajax({

        async: false,

        data: {type: "validation", request: "captcha", captcha_code: code},

        // Si la requête a correctement aboutie.
        success: function(result) {

            captcha_code = window.atob(result);

        }

    });

    return captcha_code;

}

// On récupère les heures disponibles.
function sendEmail(appointmentId) {

    // On envoi l'email de confirmation.
    $.ajax({

        data: {type: "booking", request: "mail", branch: book.branch.name, balf: book.branch.email, service: book.service.name, date: book.date.substr(8, 2)+"/"+book.date.substr(5, 2)+"/"+book.date.substr(0, 4), time: (book.time).replace(":", "h"), email: book.person.email, lastName: book.person.lastName, firstName: book.person.firstName, civility: book.person.civility, phone: book.person.phone, notes: book.person.notes, appointmentId: appointmentId},

        // Si la requête a correctement aboutie.
        success: function(result) {

            // On récupère les informations de la date actuelle.
            var informationsOfTheDate = new Date();

                // On récupère l'année en cours.
                var currentlyYear = informationsOfTheDate.getFullYear();

                // On récupère le mois en cours.
                var currentlyMonth = ("0" + (informationsOfTheDate.getMonth() + 1)).slice(-2);

                // On récupère le jour en cours.
                var currentlyDay = ("0" + informationsOfTheDate.getDate()).slice(-2);

                // On récupère l'heure en cours.
                var currentlyHour = ("0" + informationsOfTheDate.getHours()).slice(-2);

                // On récupère les minutes en cours.
                var currentlyMinute = ("0" + informationsOfTheDate.getMinutes()).slice(-2);

            // ------------------------------------------------

            var currentlyDate = new Date(currentlyYear + "-" + currentlyMonth + "-" + currentlyDay + " " + currentlyHour + ":" + currentlyMinute);
            
            // On récupère la date et l'heure du rendez-vous.

                // On récupère l'année du rendez-vous en cours.
                var appointmentYear = book.date.substr(0, 4);

                // On récupère le mois du rendez-vous en cours.
                var appointmentMonth = book.date.substr(5, 2);

                // On récupère le jour du rendez-vous en cours.
                var appointmentDay = book.date.substr(8, 2);

                // On récupère l'heure du rendez-vous en cours.
                var appointmentHour = book.time.substr(0, 2);

                // On récupère les minutes du rendez-vous en cours.
                var appointmentMinute = book.time.substr(2, 2);


            // ----------------------------------------------

            var appointmentDate = new Date(appointmentYear + "-" + appointmentMonth + "-" + appointmentDay + " " + appointmentHour + ":" + appointmentMinute);

            // On compare la différence entre la date et l'heure actuelle et celle du rendez-vous en cours.
            var difference = dateDifference(currentlyDate, appointmentDate);

            if((difference.hour > 22 && difference.min > 29) || difference.day > 0) {

                // On programme l'envoi d'un SMS de rappel à J-1.
                $.ajax({

                    data: {type: "remember", request: "mail", branch: book.branch.name, branchAddress: book.branch.addressLine1, branchShortName: book.branch.addressLine2, service: book.service.name, date: book.date.substr(8, 2)+"/"+book.date.substr(5, 2)+"/"+book.date.substr(0, 4), time: (book.time).replace(":", "h"), email: book.person.email, lastName: book.person.lastName, firstName: book.person.firstName, mobile: book.person.mobile, notes: book.person.notes, appointmentId: appointmentId},

                    // Si la requête a correctement aboutie.
                    success: function(result) {

                        emailSent = 1;

						console.log(window.atob(result));
						
                    },

                    error: function() {

                        // On affiche un message d'alerte.
                        displayAlert("Erreur lors de la validation du rendez-vous, veuillez réessayer.", 5000);

                    }

                });

            } else {

                emailSent = 1;

            }

        },

        error: function() {

            // On affiche un message d'alerte.
            displayAlert("Erreur lors de la validation du rendez-vous, veuillez réessayer.", 5000);

        }

    });

};

var tooltip=function(){
 var id = 'tt';
 var top = -200;
 var left = 0;
 var maxw = 300;
 var speed = 100;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    t = document.createElement('div');
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
    tt.style.filter = 'alpha(opacity=0)';
    document.onmousemove = this.pos;
   }
   tt.style.display = 'block';
   c.innerHTML = "Afin de mieux traiter votre demande et éventuellement vous faire gagner du temps en vous évitant un déplacement inutile, nous vous convions à nous communiquer idéalement, votre adresse électronique et/ou votre numéro de téléphone mobile et/ou votre numéro de téléphone fixe. Ces informations seront utilisées uniquement dans le cadre de votre demande de rendez-vous.";
   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  clearInterval(tt.timer);
  tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
   tt.style.filter = 'alpha(opacity=' + alpha + ')';
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();
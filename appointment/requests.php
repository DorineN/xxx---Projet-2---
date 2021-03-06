<?php

// ----------------------------------------------------------------------------------------
// ------------------------------ Configuration des requêtes ------------------------------
// ----------------------------------------------------------------------------------------

	// Adresse IP du serveur.
	$server = 'localhost';
	//$server = $_SERVER["SERVER_ADDR"];
	// Port utilisé.
	//$port = $_SERVER["SERVER_PORT"];
	$port = '8080';

// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------

// On vérifie que la requête est bien lancée depuis notre serveur, sinon on rejette la demande et l'on écrit un message d'erreur.
if(strpos($_SERVER['HTTP_REFERER'], $server) == 7 || strpos($_SERVER['HTTP_REFERER'], $server) == 8) {

	// Si la requête concerne un rendez-vous et qu'il ne manque pas le type de la requête.
	if($_POST['request'] == "book") {

		if($_POST['type']) {

			// Si la requête concerne les sites.
			if($_POST['type'] == 'branches') {

				// On définit l'url de l'api à joindre.
				$url = 'api/v1/branches/';

			// Si la requête concerne les services.
			} else if($_POST['type'] == "services") {

				// On définit l'url de l'api à joindre.
				//$url = 'api/v1/services/';
				$url = "api/v1/appointmentprofiles?branch=" . $_POST['branchId'];

			// Si la requête concerne les dates.
			} else if($_POST['type'] == "dates" && $_POST['branchPublicId'] && $_POST['servicePublicId']) {

				// On définit l'url de l'api à joindre.
				$url = 'public/api/v1/branches/'.$_POST['branchPublicId'].'/services/'.$_POST['servicePublicId'].'/dates';

			// Si la requête concerne les heures.
			} else if($_POST['type'] == "times" && $_POST['branchPublicId'] && $_POST['servicePublicId'] && $_POST['date']) {

				// On définit l'url de l'api à joindre.
				$url = 'public/api/v1/branches/'.$_POST['branchPublicId'].'/services/'.$_POST['servicePublicId'].'/dates/'.$_POST['date'].'/times';

			} else if($_POST['type'] == "book" && $_POST['branchPublicId'] && $_POST['servicePublicId'] && $_POST['date'] && $_POST['time'] && $_POST['person']) {

				// On définit l'url de l'api à joindre.
				$url = 'public/api/v1/branches/'.$_POST['branchPublicId'].'/services/'.$_POST['servicePublicId'].'/dates/'.$_POST['date'].'/times/'.$_POST['time'].'/book';

			} else if($_POST['type'] == "publicId") {

				// On définit l'url de l'api à joindre.
				$url = 'api/v1/appointments/';

			// Si la requête est incorrecte.
			} else {

				// On affiche un message d'erreur.
				print base64_encode("Erreur lors de la configuration de la requ&ecirc;te.");

				// On arrête l'exécution du code.
				return;

			}

		} else {

			// On affiche un message d'erreur.
			print base64_encode("Le type de la requ&ecirc;te n'a pas &eacute;t&eacute; définie.");

			// On arrête l'exécution du code.
			return;

		}

		// On inclus le fichier qui nous permettra de lancer des requêtes.
		include('library/Requests/Requests.php');

		// On s'assure que les requêtes peuvent charger les différentes classes internes.
		Requests::register_autoloader();

		// On configure les options de notre requête, ici on inscrit l'utilisateur et son mot de passe, on corrige un bug en mettant le paramètre "verify" à "false".
		$options = array('auth' => array($username, $password), 'verify' => false);

		// On définit le type de données que contiendra notre requête.
		$headers = array('Content-Type' => 'application/json');

		// S'il s'agit d'une requête d'envoi d'informations.
		if($_POST['type'] == "book" && $_POST['branchPublicId'] && $_POST['servicePublicId'] && $_POST['date'] && $_POST['time'] && $_POST['person'] && $server && $port && $url && $options) {

			// On lance notre requête.
			$request = Requests::post('http://'.$server.':'.$port.'/calendar-backend/'.$url, $headers, utf8_encode($_POST['person']), $options);

		// S'il s'agit d'une requête de demande d'informations.
		} else if($server && $port && $url && $options) {

			// On lance notre requête.
			$request = Requests::get('http://'.$server.':'.$port.'/calendar-backend/'.$url, $headers, $options);

		// S'il manque un ou plusieurs paramètres de configuration.
		} else {

			// On affiche un message d'erreur.
			print base64_encode("Un ou plusieurs param&egrave;tres de configuration sont manquants.");

			// On arrête l'exécution du code.
			return;
		}

		// Si la requête a correctement aboutie.
		if($request->status_code == 200) {

			// On retranscrit les données reçues.
			print base64_encode($request->body);               

		// Si la requête n'a pas aboutie.
		} else {

			// On affiche un message d'erreur.
			print base64_encode("Erreur lors de la requ&ecirc;te.");

		}


	} else if($_POST['request'] == "mail") {

		if($_POST['type']) {

			// Si c'est un rendez-vous.
			if($_POST['type'] == "booking") {

				// On définit le type du rendez-vous.
				$type = "Résumé de votre rendez-vous";

			// Si c'est un E-ticket.
			} elseif($_POST['type'] == "eticket") {

				// On définit le type du rendez-vous.
				$type = "Résumé de votre e-ticket";

			// Si c'est un rappel de rendez-vous.
			} else if($_POST['type'] == "remember") {

				// On définit le type du rendez-vous.
				$type = "Rappel de votre rendez-vous";

			// Si il n'y a aucun type.
			} else {

				// On affiche un message d'erreur.
				print base64_encode("Erreur lors de la configuration de la requ&ecirc;te.");

				// On arrête l'exécution du code.
				return;
				
			}

			// On inclus la page de configuration du générateur d'email.
			require_once('library/mail/class.phpmailer.php');

			// On créer un nouvel email.
			$mail = new PHPMailer();
			
			// On indique qu'on envoi l'email via un serveur SMTP.
			$mail->IsSMTP();

			$mail->IsHTML(true);

			$mail->Host        = "smtp.rendezvousqmatic.fr";
			$mail->Port        = "587";
			$mail->Username    = "ne-pas-repondre@rendezvousqmatic.fr";
			$mail->Password    = "Qmmatic";
			$mail->From        = "ne-pas-repondre@rendezvousqmatic.fr";
			$mail->FromName    = "Rendez-vous impots.gouv.fr";

			$branchShortName = $_POST['branchShortName'];

			$service = (string) utf8_encode($_POST['service']);

			if($_POST['type'] == "remember") {

				$timestamp = mktime(substr($_POST['time'], 0, 2), substr($_POST['time'], 3, 2), 0, substr($_POST['date'], 3, 2), substr($_POST['date'], 0, 2), substr($_POST['date'], 6, 4));

				$Deferred = date("HidmY", strtotime("-1 day", $timestamp));
				
				$mail->AddAddress  ("email2sms@ovh.net");

/*				print base64_encode(substr($_POST['phone'], 1));

				print base64_encode("-------");

				print base64_encode($_POST['date']);

				print base64_encode("-------");

				print base64_encode($_POST['time']);

				print base64_encode("-------");

				print base64_encode($branchShortName);

				print base64_encode("-------");

				print base64_encode($_POST['appointmentId']);

				print base64_encode("-------");

				print base64_encode($Deferred);*/

				$mail->Subject     = "Account=sms-br84350-2;Login=dgfip;Password=dgfip123;From=Rendez-vous;To=+33".substr($_POST['mobile'], 1).";Deferred=".$Deferred.";NoStop=1";
				$mail->Body        = "Bonjour,<br>N'oubliez pas votre rendez-vous du ".$_POST['date']." à ".$_POST['time']." au ".$branchShortName.".<br>Votre numéro est le ".$_POST['appointmentId'].".";

			} else {

				$mail->AddAddress  ($_POST['email'], "".$_POST['lastName']." ".$_POST['firstName']."");
				$mail->Subject     = $type;

				// BLOC 1 :
				$mail->Body       = "Bonjour ".$_POST['civility']." ". (string) utf8_encode($_POST['lastName']).",<br><br>";
				$mail->Body      .= "La DGFiP vous confirme votre rendez-vous du ".$_POST['date']." à ".$_POST['time']." au service ". (string) utf8_decode($_POST['branch']).".<br>";
				$mail->Body      .= "Votre numéro de rendez-vous est le ".$_POST['appointmentId'].".<br><br>";

				// BLOC SIE
				if(substr_count($_POST['branch'], "SERVICE IMPOTS DES ENTREPRISES") > 0)  {

					if($service == "Le paiement d'un impôt") {

						$mail->Body      .= "Si, lors de votre rendez-vous, vous souhaitez faire état de difficultés de paiement, merci d'apporter tous les documents que vous jugerez utiles ";
						$mail->Body      .= "pour l’examen de votre demande.<br><br>";

					} else if($service == "La création, la cession ou la cessation d'une activité") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents que vous jugerez utiles pour l'examen ";
						$mail->Body     .= "de votre demande portant sur la création, la cession ou la cessation d'une activité.<br><br>";

					} else if($service == "Le Régime des auto-entrepreneurs/des SCI/ des associations") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur le régime des auto-entrepreneurs/des SCI/des associations. Exemple, statuts pour les associations.<br><br>";

					} else if($service == "Une demande de quitus") {

						$mail->Body     .= "Lors de votre rendez-vous, vous devez apporter tous les documents nécessaires à l'examen de votre demande de quitus : <br>";
						$mail->Body     .= "<ul><li>Original et copie de la facture ou de l'acte de vente (formulaire cerfa n° 13754*02), ";
						$mail->Body     .= "accompagné d'une traduction effectuée par un traducteur agréé si le document est en langue étrangère,</li> ";
						$mail->Body     .= "<li>Certificat d'immatriculation à l'étranger si le véhicule est déjà immatriculé,</li> ";
						$mail->Body     .= "<li>Une pièce d'identité (extrait K bis pour les sociétés)et un justificatif de domicile. Plus de détails sur ces justificatifs, en cliquant sur le lien ci-dessous : (http://vosdroits.service-public.fr/particuliers/F31853.xhtml). </li></ul><br><br>";

					} else if($service == "Les impôts d'Etat (IS/BIC/BNC/BA/TVA)") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur les impôts d'Etat (IS/BIC/BNC/BA/TVA).<br><br>";

					} else if($service == "Les impôts locaux (CFE/CVAE/IFER)") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur les impôts locaux (CFE/CVAE/IFER).<br><br>";

					} else if($service == "Autres renseignements") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront vous être utiles à l'examen ";
						$mail->Body     .= "de votre demande.<br>";
						$mail->Body     .= "Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ";
						$mail->Body     .= "Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.<br><br>";

					}

				// BLOC SIP
				} else if(substr_count($_POST['branch'], "SERVICE IMPOTS PARTICULIERS") > 0) {

					if ($service == "Le paiement d'un impôt") {

						$mail->Body     .= "Si lors de votre rendez-vous, vous souhaitez faire état de difficultés de paiement, merci d'apporter tous les documents utiles ";
						$mail->Body     .= "à l'examen de votre demande, notamment pour justifier du montant de vos revenus (bulletins de salaires des 3 derniers mois,...) et de vos charges (loyers, emprunt(s)...).<br><br>";

					} else if($service == "Les changements de situation familiale") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur les changements de situation familiale. Exemple : livret de famille, acte de mariage, jugement de divorce...<br><br>";

					} else if($service == "Première déclaration de revenus") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur votre première déclaration de revenus : pièces d'identité, bulletin de salaire, justificatif de domicile ";
						$mail->Body     .= "(copie d'un contrat de location ou attestation d'hébergement accompagnée du contrat de location de la personne qui vous héberge).<br><br>";

					} else if($service == "Les investissements locatifs et les revenus fonciers") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur les investissements locatifs et les revenus fonciers. Exemple : acte d'achat, contrat de bail, ";
						$mail->Body     .= "justificatifs de charges, engagement de location.<br><br>";
						
					
					} else if($service == "Les revenus perçus à l'étranger") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur les revenus perçus à l'étranger. Exemple : justificatif de l’encaissement des sommes, tout document ";
						$mail->Body 	.= "justifiant de la nature des revenus (bulletin de salaire, quittance de loyer), justificatif éventuel du paiement de l’impôt à l’étranger...<br><br>";
				
					} else if($service == "L'impôt sur le revenu") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur l'impôt sur le revenu.<br><br>";
						

					} else if($service == "La taxe d'habitation, la contribution audiovisuelle publique, la taxe sur les logements vacants") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur la taxe d'habitation, la contribution audiovisuelle publique (redevance TV) ou la taxe sur les logements vacants. ";
						$mail->Body 	.= "Exemple : justificatif de domicile au 1er janvier, état des lieux d’entrée, état des lieux de sortie, copie du bail...<br><br>";

					} else if($service == "La taxe foncière") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur la taxe foncière. Exemple : acte d’achat, plans et métrages précis de l’habitation, résiliation du bail...<br><br>";

					} else if($service == "Autres renseignements") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront vous être utiles à l'examen de votre demande. ";
						$mail->Body     .= "Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ";
						$mail->Body 	.= "Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.<br><br>";
					
				}
				// BLOC Trésorerie
				} else if(substr_count($_POST['branch'], "TRESORERIE") > 0) {

					if($service == "Le paiement d'un impôt") {

						$mail->Body     .= "Si lors de votre rendez-vous, vous souhaitez faire état de difficultés de paiement, merci d'apporter tous les documents utiles ";
						$mail->Body     .= "pour l'examen de votre demande, notamment pour justifier du montant de vos revenus (bulletins de salaires des 3 derniers mois,...) et de vos charges (loyers, emprunt(s)...).<br><br>";

					} else if($service == "Autres renseignements") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront vous être utiles à l'examen de votre demande. ";
						$mail->Body     .= "Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ";
						$mail->Body 	.= "Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.<br><br>";
					}
				

				// BLOC CDIF
				} else if(substr_count($_POST['branch'], "FONCIER") > 0) {

					if($service == "La souscription d'une déclaration pour la taxe foncière") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas de vous munir de tous les documents dont vous disposez à propos de ce bien : ";
						$mail->Body     .= "acte notarié, baux, états des lieux, mesurages des surfaces, photographies intérieures et/ou extérieures permettant d'en apprécier la consistance et l'état,...<br><br>";

					} else if($service == "Une réclamation sur le montant de la taxe foncière") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront vous être utiles à l'examen ";
						$mail->Body     .= "de votre demande portant sur la réclamation sur le montant de la taxe foncière. ";
						$mail->Body 	.="(exemple pour un immeuble restant innocupé pouvant bénéficier d'une exonération : bail de sortie, bail entrant, justificatifs de recherche de locataires...).<br><br>";
					
					} else if($service == "Autres renseignements") {

						$mail->Body     .= "Lors de votre rendez-vous, n'oubliez pas d'apporter tous les documents qui pourront vous être utiles à l'examen de votre demande. ";
						$mail->Body     .= "Vous trouverez sur le site impots.gouv.fr les réponses aux demandes de renseignements les plus fréquentes. ";
						$mail->Body 	.= "Vous pouvez également y réaliser directement et sans déplacement vos principales démarches.<br><br>";
					}
				
				

				}

				// BLOC 3 :
				$mail->Body     .= "En cas d'empêchement, nous vous remercions de nous prévenir par mail à l'adresse suivante : ".$_POST['balf'].".<br>";
				$mail->Body     .= "La DGFIP vous remercie de votre confiance.<br><br>";	
				$mail->Body     .= "<i>Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion automatisée de la prise de rendez-vous";
				$mail->Body     .= " personnalisée avec les services de la Direction générale des finances publiques (DGFIP). Les destinataires des données sont les agents habilités de la DGFIP.<br><br>";
				$mail->Body     .= "Conformément à la loi « informatique et libertés » du 6 Janvier 1978 modifiée en 2004, vous bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent, ";
				$mail->Body     .= "que vous pouvez exercer en adressant un courriel à l'adresse électronique précitée ou en écrivant par lettre simple auprès du service Cap numérique ";
				$mail->Body     .= "(direction générale des finances publiques) bureau référentiels et relations usagers 4, avenue Montaigne 93468 Noisy-le-Grand Cedex.<br><br>";
				$mail->Body     .= "Vous pouvez également, pour des motifs légitimes, vous opposer au traitement des données vous concernant. »</i>";


			}

			// Si l'email n'a pas pu être envoyé.
			if(!$mail->Send()) {
			
				// On définit le message d'erreur.
				print base64_encode("Erreur lors de l'envoi de l'email");
					
			// Si l'email a pu être envoyé.
			} else {
			
				// On définit le message d'erreur.
				print base64_encode("Email envoy&eacute; avec succ&egrave;s");

			}

		} else {

			// On affiche un message d'erreur.
			print base64_encode("Le type de la requ&ecirc;te n'a pas &eacute;t&eacute; d&eacute;finie.");

			// On arrête l'exécution du code.
			return;

		}

	} else if($_POST['request'] == "captcha") {

		if($_POST['type']) {

				require_once 'library/securimage/securimage.php';
		        
		        $image = new Securimage();

			// Si c'est un rendez-vous.
			if($_POST['type'] == "initialization") {

		        print base64_encode($image::getCaptchaHtml());

			} else if($_POST['type'] == "validation") {

				if($_POST['captcha_code']) {

					if ($image->check($_POST['captcha_code']) == true) {

						print base64_encode("trueCode");

					} else {

						print base64_encode("falseCode");

					}

				} else {

					print base64_encode("unknown");

				}

			}

		} else {

			// On affiche un message d'erreur.
			print base64_encode("Le type de la requ&ecirc;te n'a pas &eacute;t&eacute; d&eacute;finie.");

			// On arrête l'exécution du code.
			return;

		}

	} else if($_POST['request'] == "appointment") {

		if($_POST['type']) {

			if($_POST['type'] == "result") {

				// On inclus le fichier qui nous permettra de lancer des requêtes.
				include('library/Requests/Requests.php');

				// On s'assure que les requêtes peuvent charger les différentes classes internes.
				Requests::register_autoloader();

				// On récupère la date d'aujourd'hui.
				$start = date("Y-m-d");

				// On récupère la date du surlendemain.
				$end = date('Y-m-d', time() + 3600 * 48);

				// On définit l'url de l'api à joindre.
				$url = 'api/v1/appointments?start='.$start.'&end='.$end;

				// On définit le type de données que contiendra notre requête.
				$headers = array('Content-Type' => 'application/json');

				// On configure les options de notre requête, ici on inscrit l'utilisateur et son mot de passe, on corrige un bug en mettant le paramètre "verify" à "false".
				$options = array('auth' => array($username, $password), 'verify' => false);

				// On lance notre requête.
				$request = Requests::get('http://'.$server.':'.$port.'/calendar-backend/'.$url, $headers, $options);

				// Si la requête a correctement aboutie.
				if($request->status_code == 200) {

					print base64_encode($request->body);

				// Si la requête n'a pas aboutie.
				} else {

					// On affiche un message d'erreur.
					print base64_encode("Erreur lors de la requ&ecirc;te.");

				}

			// Si la requête est incorrecte.
			} else {

				// On affiche un message d'erreur.
				print base64_encode("Erreur lors de la configuration de la requ&ecirc;te.");

				// On arrête l'exécution du code.
				return;

			}

		} else {

			// On affiche un message d'erreur.
			print base64_encode("Le type de la requ&ecirc;te n'a pas &eacute;t&eacute; définie.");

			// On arrête l'exécution du code.
			return;

		}



	} else {

		// On affiche un message d'erreur.
		print base64_encode("Vous devez param&egrave;trer le type de votre requ&ecirc;te.");

	}

// Si la requête ne provient pas de notre serveur, on rejette la demande et on affiche un message d'erreur.
} else {

	// On affiche un message d'erreur.
	print base64_encode("Vous n'avez pas le droit d'acc&egrave;der &agrave; cette page");

}

?>
<!DOCTYPE html>
<html lang="fr">
	<head>
		<title>Maison des Ligues de Lorraine - Réservation de salle</title>
		<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    	<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><![endif]-->
    	<link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">
		<link rel="stylesheet" href="css/style.css">
		<link rel="stylesheet" href="css/bootstrap.min.css">
	</head>
	<body>
		<div id="header">
			<div style="margin-bottom: -35px; min-height: 170px; padding: 15px 15px 0 0;">
				<div style="float: left; width: auto;">
					<!-- LINKS BOX -->
					<div style="width: 120px; float: left;">
						<a href="http://www.maisondesliguesdelorraine.fr/" title="maisondesliguesdelorraine.fr" target="_blank" style="border: 0; height: 50px;"><img src="images/mdl_logo.png" alt="" title="" class="image" style="margin: auto; width: 150%;"></a>
					</div>
					<!-- LINKS BOX END -->
				</div>
			</div>
			<div id="headerTitle"></div>
		</div>
		<div id="content">
		<div id="contentCenter">
			<div class="alert alert-danger" id="contentAlert">Message d'erreur</div>
			<div class="alert alert-warning" id="reminderService"></div>
			<div id="step1">
				<div class="panel panel-default">
					<div class="panel-heading">
				    	<h3 class="panel-title">Veuillez sélectionner une salle</h3>
				  	</div>
				  	<div class="panel-body">
				    	<div class="row">
				    		<div id="branchesList"><div id="loading"><img src="images/loading.gif" alt="" title=""></div></div>
				    	</div>
				  	</div>
				</div>
			</div>
			<div id="step2">
				<div class="panel panel-default">
					<div class="panel-heading">
				    	<h3 class="panel-title" id="service-title">Veuillez sélectionner un motif de réservation</h3>
				  	</div>
				  	<div class="panel-body">
				    	<div class="row">
				    		<div id="servicesList"><div id="loading"><img src="images/loading.gif" alt="" title=""></div></div>
				    	</div>
				  	</div>
				</div>
			</div>
			<div id="step3">
				<div class="panel panel-default">
					<div class="panel-heading">
				    	<h3 class="panel-title">Veuillez sélectionner une date</h3>
				  	</div>
				  	<div class="panel-body">
				    	<div id="dateList"></div>
				  	</div>
				</div>
			</div>
			<div id="step4">
				<div class="panel panel-default">
					<div class="panel-heading">
				    	<h3 class="panel-title">Veuillez sélectionner une heure</h3>
				  	</div>
				  	<div class="panel-body">
				    	<div id="timeList"></div>
				  	</div>
				</div>
			</div>
			<div id="step5">
				<div class="panel panel-default">
					<div class="panel-heading">
				    	<h3 class="panel-title">Veuillez saisir vos informations personnelles</h3>
				  	</div>
				  	<div class="panel-body">
					
					<div class="openInfos">
					<script type="text/javascript">
					<!--
					function openInfos() {
					if(step == 4) {
					
					alert ('test');
					}
					}
					-->
					</script>
					
					</script>
					</div>

				  		<table class="personalInformationsTable">

				  			<tr>

				  				<td style="padding:10px;">

									<label class="control-label" for="civility">Civilité *</label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-user.png" alt="" title=""></span>

									 	<select id="civility" class="form-control">

									 	    <option value="0">Mr</option>
									 	    
							                <option value="1">Mme</option>

						                </select>

									</div>

								</td>

								<td style="padding:10px;">

									<label class="control-label" for="email">Adresse électronique * <img onmouseover="tooltip.show();" onmouseout="tooltip.hide();" src="images/icon-help.png" id="icon-help" alt="" title=""></label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-email.png" alt="" title=""></span>

										<input type="text" id="email" class="form-control" maxlength="50">

									</div>

								</td>

							</tr>

							<tr>

				  				<td style="padding:10px;">

									<label class="control-label" for="lastName">Nom *</label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-user.png" alt="" title=""></span>

									 	<input type="text" id="lastName" class="form-control" maxlength="30">

									</div>

								</td>

								<td style="padding:10px;">

									<label class="control-label" for="mobile">Téléphone mobile * <img onmouseover="tooltip.show();" onmouseout="tooltip.hide();" src="images/icon-help.png" id="icon-help" alt="" title=""></label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-phone.png" alt="" title=""></span>

									 	<input type="text" id="mobile" class="form-control" maxlength="30">

									</div>

								</td>

							</tr>

							<tr>

				  				<td style="padding:10px;">

									<label class="control-label" for="firstName">Prénom *</label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-user.png" alt="" title=""></span>

										<input type="text" id="firstName" class="form-control" maxlength="30">

									</div>

								</td>

								<td style="padding:10px;">

									<label class="control-label" for="phone">Téléphone fixe * <img onmouseover="tooltip.show();" onmouseout="tooltip.hide();" src="images/icon-help.png" id="icon-help" alt="" title=""></label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-phone.png" alt="" title=""></span>

										<input type="text" id="phone" class="form-control" maxlength="10">

									</div>

								</td>

							</tr>

							<tr class="codespi">
							
				  				<td style="padding:10px;" colspan="2">

									<label class="control-label" for="spi">Numéro fiscal<a onclick="open('https://cfspart.impots.gouv.fr/templates/IR2014aide_numFiscal.html', 'Popup', 'scrollbars=1,resizable=1,height=500,width=500'); return false;"><img src="images/icon-help.png" id="icon-help" alt="" title=""></a></label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-user.png" alt="" title=""></span>

									 	<input type="text" id="spi" class="form-control" maxlength="30">

									</div>

								</td>

							</tr>

							<tr class="groupPro">

				  				<td style="padding:10px;">

									<label class="control-label" for="siren">SIREN *</label>

										<div class="input-group input-group-sm">

											<span class="input-group-addon"><img src="images/icon-user.png" alt="" title=""></span>

										 	<input type="text" id="siren" class="form-control" maxlength="30">

										</div>

								</td>

								<td style="padding:10px;">

									<label class="control-label" for="raissoc">Raison Sociale *</label>

									<div class="input-group input-group-sm">

										<span class="input-group-addon"><img src="images/icon-user.png" alt="" title=""></span>

									 	<input type="text" id="raissoc" class="form-control" maxlength="30">

									</div>

								</td>

							</tr>

							<tr>

								<td style="padding:10px;" colspan="2">

									<label class="control-label" for="notes">Vous demandez un rendez-vous pour...</label>

					  				<input class="form-control" id="service" rows="2" maxlength="500"></input>

									<br>

									<label class="control-label" for="notes">Afin de mieux traiter votre demande, veuillez en détailler le motif *</label>

					  				<textarea class="form-control" id="notes" rows="3" maxlength="500"></textarea>

								</td>

							</tr>

							<tr>

								<td style="padding:10px;" colspan="2">

									<br>
									
									<div id="captcha" style="text-align:center;"></div>

								</td>

							</tr>

				  		</table>

				  		<div style="margin:10px;font-size:12px;"><em>Attention : Toutes les mentions ayant un * sont obligatoires.</em></div>

				  	</div>

				</div>

			</div>
			<!-- /Étape 5 : Saisie des informations personnelles -->

			<!-- Étape 6 : Validation des informations -->
			<div id="step6">

				<div class="panel panel-default">

					<div class="panel-heading">

				    	<h3 class="panel-title">Validation des informations</h3>

				  	</div>

				  	<div class="panel-body">

				  	<table class="table">

			        <thead>

			          <tr>

			            <th colspan="2">Informations du rendez-vous</th>

			          </tr>

			        </thead>

			        <tbody>

			          <tr>

			            <td>Service</td>

			            <td id="validationBranch"></td>

			          </tr>

			          <tr>

			            <td>Adresse</td>

			            <td>
			            <p id="validationAddress"></p>
			            <span id="validationCodePostal"></span>
			            <span id="validationVille"></span>

			            </td>

			          </tr>

			          <tr>

			            <td>Date</td>

			            <td id="validationDate"></td>

			          </tr>

			          <tr>

			            <td>Heure</td>

			            <td id="validationTime"></td>

			          </tr>

			        </tbody>

			      </table>

			      <table class="table">

			        <thead>

			          <tr>

			            <th colspan="2">Informations personnelles</th>

			          </tr>

			        </thead>

			        <tbody>

			          <tr>

			            <td>Nom</td>

			            <td id="validationLastName"></td>

			          </tr>

			          <tr>

			            <td>Prénom</td>

			            <td id="validationFirstName"></td>

			          </tr>

			          <tr>

			            <td>Email</td>

			            <td id="validationEmail"></td>

			          </tr>

			          <tr>

			            <td>Téléphone fixe</td>

			            <td id="validationPhone"></td>

			          </tr>
					  
					  <tr>

			            <td>Téléphone mobile</td>

			            <td id="validationMobile"></td>

			          </tr>

			          <!--groupPro validation-->
			          <tr class="groupPro">

			          	<td>SIREN</td>

			          	<td id="validationSiren"></td>

			          </tr>

			          <tr class="groupPro"> 
			          
			          	<td>Raison sociale</td>

			          	<td id="validationRaissoc"></td>

			        </tr>

			          <tr>
			          <!--Fin du groupPro validation-->

			            <td>Motif du rendez-vous</td>

			            <td id="validationService"></td>

			          </tr>


			          <tr>

			            <td>Informations complémentaires sur votre rendez-vous</td>

			            <td id="validationNotes"></td>

			          </tr>

			        </tbody>

			      </table>

			      <table class="table">

			        <thead>

			          <tr>

			            <th colspan="2">Pièces justificatives</th>

			          </tr>

			        </thead>

			        <tbody>
			          <tr>
			            <td style="text-align: justify;" id="validationPiecesJustificatives"></td>
			          </tr>
			        </tbody>
			      </table>
				  	</div>
				</div>
			</div>
			<div id="step7">
				<div class="panel panel-default">
					<div class="panel-heading">
				    	<h3 class="panel-title">Votre rendez-vous est validé</h3>
				  	</div>
				  	<div class="panel-body" style="text-align: center;">
				  		<div id="appointmentSuccess">
					  		<div id="loading"><img src="images/loading.gif" alt="" title=""></div>
						</div>
				  	</div>
				</div>
			</div>
			<div class="panel panel-default" id="navigationButtons">
				<div class="panel-body" style="text-align:center; padding-bottom: 13px;">
					<button style="text-align:center;" type="button" class="btn btn-lg btn-default" id="previousButton" onclick="previousStep()"> <span class="prev"><img src="images/arrow_left.png" alt="" title=""></span> Retour</button>
					<button type="button" class="btn btn-lg btn-default" id="nextButton" onclick="nextStep()">Suivant <span class="next"><img src="images/arrow_right.png" alt="" title=""></span></button>
				</div>
			</div>
		</div>
		</div>
		<div id="footer"></div>
		<script src="scripts/jquery-1.11.1.min.js"></script>
		<script src="scripts/jquery-ui.min.js"></script>
		<script src="scripts/script.js"></script>
		<script>
			var civility = "<?php print base64_decode($_POST['civility']); ?>";
			var lastname = "<?php print base64_decode($_POST['lastname']); ?>";
			var firstname = "<?php print base64_decode($_POST['firstname']); ?>";
			var phone = "<?php print base64_decode($_POST['phone']); ?>";
			var mobile = "<?php print base64_decode($_POST['mobile']); ?>";
			var mail = "<?php print base64_decode($_POST['mail']); ?>";
			var spi = "<?php print base64_decode($_POST['spi']); ?>";
			var siren = "<?php print base64_decode($_POST['siren']); ?>";
			var title = "<?php print base64_decode($_POST['titre']); ?>";
			var raissoc = "<?php print base64_decode($_POST['raissoc']); ?>";
			recoverPostVariables(branch, personType, civility, lastname, firstname, phone, mobile, mail, spi, siren, title, raissoc);
			hsh = new Date();
		    hsd = document;
		    hsr = hsd.referrer.replace(/[<>]/g, '');
		    hsi = '<img width="1" height="1" src="https://logs2.xiti.com/hit.xiti?s=244754&s2=6';
		    hsi += '&p=qmatic';
		    hsi += '&hl=' + hsh.getHours() + 'x' + hsh.getMinutes() + 'x' + hsh.getSeconds();
		    if(parseFloat(navigator.appVersion)>=4)
		    {Xiti_s=screen;hsi += '&r=' + Xiti_s.width + 'x' + Xiti_s.height + 'x' + Xiti_s.pixelDepth + 'x' + Xiti_s.colorDepth;}
		    hsd.writeln(hsi + '&ref=' + hsr.replace(/&/g, '$') + '" />');
		</script>
	</body>
</html>
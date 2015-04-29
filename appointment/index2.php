<html>
    <head>

    <title>Réservation de salles - M2L</title>

<style type="text/css">
.form {
text-align: center; 
margin-top: 5%; 
width: auto;
margin: auto;
}
</style>

        <!-- On ajoute un petit icone à côté de l'URL -->
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">

        <!-- On charge le style -->
        <link rel="stylesheet" href="booking/css/style.css">

        <!-- On charge le style bootstrap -->
        <link rel="stylesheet" href="booking/css/bootstrap.min.css">

</head>

    <body>

<!--EntÃªte avec logos & lien vers site internet -->

<!--BanniÃ¨re -->
<div style="margin-bottom: -35px; min-height: 170px; padding: 15px 15px 0 0;">

    <div style="float: left; width: auto;">

                <!-- LINKS BOX -->
                <div style="width: 120px; float: left;">
                    <a href="http://www.maisondesliguesdelorraine.fr/" title="maisondesliguesdelorraine.fr" target="_blank" style="border: 0; height: 50px;"><img src="booking/images/mdl_logo.png" alt="" title="" class="image" style="margin: auto; width: 150%;"></a>
                </div>
                <!-- LINKS BOX END -->
    </div>

</div>
<!--Fin entête avec logos & lien -->
        
        <!-- Début fomrulaire -->
        <form class="form" id="test1" method="post" action="booking/index.php" >
        
    <div class="panel panel-default">

        <div class="panel-heading">

            <h3 class="panel-title">Veuillez remplir le formulaire de test</h3>

        </div>

        <div class="panel-body">

                        
            <table style="margin: auto; width: auto; margin-bottom: 1%;">

    <tr>
                <!-- Branches - Sites -->
        <td style="padding-right:10px;">
                <label class="control-label">Choisissez une salle *</label>
                <div class="input-group input-group-sm">
                 <select name="branch" text id="branch" class="form-control">
                 <option value="">Sélectionnez</option>
                    <option value="usa">Salle USA</option>
                    <option value="espagne">Salle Espagne</option>
                    <option value="japon">Salle Japon</option>
                    <option value="angleterre">Salle Angleterre</option>
                    <option value="canada">Salle Canada</option>
                    <option value="mexique">Salle Mexique</option>
                    <option value="chine">Salle Chine</option>
                    <option value="allemagne">Salle Allemagne</option>
					<option value="amphitheatre">Amphithéâtre</option>
                    <option value="formation">Salle de Formation</option>
                    </select>
                </div>
                <br>
                        <!-- Choix du Type -->

                <label class="control-label">Choisissez une date *</label>
                <div class="input-group input-group-sm">
                <input name="date"  type="date" class="form-control">
                </div>
                    <br>
				<label class="control-label">Choisissez une heure *</label>
                <div class="input-group input-group-sm">
                <input name="time"  type="time" class="form-control">
                </div>
                    <br>


            <!-- Nom -->
            <label class="control-label">Nom</label>
            <div class="input-group input-group-sm">
			<input type="text" id="lastName" name="lastname" class="form-control" text maxlength="30"/>
            </div>
                <br>
            <!-- TÃ©lÃ©phone -->
             <label class="control-label">T&eacute;l&eacute;phone fixe</label>
                <div class="input-group input-group-sm">
            <input type="text" name="phone" class="form-control" maxlength="30"/>
            </div>
                <br>
            <!-- Mail -->
             <label class="control-label">Mail</label>
             <div class="input-group input-group-sm">
            <input type="text" name="mail" class="form-control" text maxlength="50"/>
            </div><br>

            <!--Validation -->
            <input type="submit" name="valider" value="Envoyer" style="text-align: right; margin-left: 45%; margin-top: 10%;" />
        </td>

    </tr>

</table>
            </div>

        </div>

    </form>

<footer id="footer">Copyright M2L - 2015</footer>

</body>

</html>
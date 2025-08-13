import nodemailer from "nodemailer";
import type { Transfer, User, Order, OrderItem } from "@shared/schema";
import { storage } from "./storage";

// Configuration SMTP PlanetHoster
const transporter = nodemailer.createTransport({
    host: "hc-weeklygrowndoe-eu.n0c.com",
    port: 25,
    secure: false, // true pour 465, false pour 587 ou 25
    auth: {
        user: "noreply@gisabogroup.ca",
        pass: "Wtz4rtEYe89D!",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Email de l'administrateur (à configurer selon vos besoins)
const ADMIN_EMAIL = "admin@gisabogroup.ca"; // Vous pouvez changer cet email
const FROM_EMAIL = "noreply@gisabogroup.ca"; // Email expéditeur vérifié dans SendGrid

export async function sendTransferConfirmationEmail(
    transfer: Transfer,
    user: User,
    paymentId: string,
    paymentMethod?: string,
): Promise<boolean> {
    try {
        // Récupérer le taux de change dynamiquement depuis la base de données
        const amountCAD = parseFloat(transfer.amount);
        let exchangeRate: number | null = null;
        let amountBIF: number | null = null;

        // Récupérer le taux réel depuis la base
        try {
            const rate = await storage.getExchangeRate("CAD", "BIF");
            if (rate) {
                exchangeRate = Number(rate.rate);
                amountBIF = Math.round(amountCAD * exchangeRate);
            }
        } catch (error) {
            console.log(
                "Erreur lors de la récupération du taux de change:",
                error,
            );
        }

        // Générer le numéro de référence
        const refNumber = `REF-${transfer.id.toString().padStart(7, "0")}`;

        // Template d'email
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de Transfert - Gisabo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E8B57, #32CD32); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #2E8B57; }
        .section h3 { margin-top: 0; color: #2E8B57; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; }
        .footer { background: #2E8B57; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .amount-highlight { background: #e8f5e8; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: #2E8B57; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌍 Gisabo Transfert d'argent</h1>
            <p>Confirmation de Transaction</p>
        </div>
        
        <div class="content">
            <p><strong>Cher(e) ${user.firstName} ${user.lastName},</strong></p>
            <p>Merci d'avoir utilisé Gisabo Transfert d'argent.</p>
            <p>Vous trouverez ci-dessous les détails de votre transaction.</p>
            <p><strong>Cordialement,</strong></p>
            <p><em>L'équipe Gisabo</em></p>

            <div class="section">
                <h3>📋 Informations Expéditeur</h3>
                <div class="info-row">
                    <span class="label">Nom et Prénom(s):</span>
                    <span>${user.firstName} ${user.lastName}</span>
                </div>
                <div class="info-row">
                    <span class="label">E-mail:</span>
                    <span>${user.email}</span>
                </div>
                <div class="info-row">
                    <span class="label">Téléphone:</span>
                    <span>${user.username}</span>
                </div>
            </div>

            <div class="section">
                <h3>👤 Informations Bénéficiaire</h3>
                <div class="info-row">
                    <span class="label">Nom et Prénom(s):</span>
                    <span>${transfer.recipientName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Téléphone:</span>
                    <span>${transfer.recipientPhone}</span>
                </div>
            </div>

            <div class="section">
                <h3>💰 Informations de Transaction</h3>
                <div class="info-row">
                    <span class="label">Numéro REF:</span>
                    <span><strong>${refNumber}</strong></span>
                </div>
                <div class="amount-highlight">
                    ${
                        amountBIF !== null
                            ? `Montant reçu: ${amountBIF.toLocaleString()} BIF`
                            : `Montant envoyé: ${amountCAD.toFixed(2)} CAD (Taux de change non configuré)`
                    }
                </div>
                ${
                    exchangeRate !== null
                        ? `<div class="info-row">
                        <span class="label">Taux de change:</span>
                        <span>1 CAD = ${exchangeRate.toLocaleString()} BIF</span>
                    </div>`
                        : `<div class="info-row">
                        <span class="label">Taux de change:</span>
                        <span style="color: #e74c3c;">Non configuré - Veuillez contacter l'administration</span>
                    </div>`
                }
                <div class="info-row">
                    <span class="label">Mode livraison:</span>
                    <span>${transfer.deliveryMethod}</span>
                </div>
                ${
                    transfer.bankName
                        ? `
                <div class="info-row">
                    <span class="label">Nom de la banque:</span>
                    <span>${transfer.bankName}</span>
                </div>
                `
                        : ""
                }
                ${
                    transfer.accountNumber
                        ? `
                <div class="info-row">
                    <span class="label">Numéro de compte:</span>
                    <span>${transfer.accountNumber}</span>
                </div>
                `
                        : ""
                }
                <div class="info-row">
                    <span class="label">ID Paiement Square:</span>
                    <span>${paymentId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Méthode de paiement:</span>
                    <span>${paymentMethod === 'afterpay' ? '💳 Afterpay (4 paiements)' : '💳 Carte bancaire'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Relevé sur carte bancaire:</span>
                    <span>SQ*Coop Arcade</span>
                </div>
            </div>

            ${paymentMethod === 'afterpay' ? `
            <div class="section" style="border-left-color: #9b59b6;">
                <h3>🔄 Informations Afterpay</h3>
                <p style="color: #9b59b6; font-weight: bold;">Votre paiement sera divisé en 4 échéances égales :</p>
                <div class="info-row">
                    <span class="label">1er paiement (aujourd'hui):</span>
                    <span><strong>${(amountCAD / 4).toFixed(2)} CAD</strong></span>
                </div>
                <div class="info-row">
                    <span class="label">2ème paiement (dans 2 semaines):</span>
                    <span><strong>${(amountCAD / 4).toFixed(2)} CAD</strong></span>
                </div>
                <div class="info-row">
                    <span class="label">3ème paiement (dans 4 semaines):</span>
                    <span><strong>${(amountCAD / 4).toFixed(2)} CAD</strong></span>
                </div>
                <div class="info-row">
                    <span class="label">4ème paiement (dans 6 semaines):</span>
                    <span><strong>${(amountCAD / 4).toFixed(2)} CAD</strong></span>
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 15px;">
                    ℹ️ Aucun intérêt ni frais cachés. Les prélèvements automatiques se feront selon le calendrier Afterpay.
                </p>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <p>🌍 <strong>Gisabo Group</strong> - Votre partenaire de confiance pour les transferts d'argent</p>
            <p>📧 Contact: info@gisabogroup.ca | 🌐 www.gisabogroup.ca</p>
        </div>
    </div>
</body>
</html>
    `;

        // Préparer les informations de montant et taux
        const amountInfo =
            amountBIF !== null
                ? `Montant reçu: ${amountBIF.toLocaleString()} BIF`
                : `Montant envoyé: ${amountCAD.toFixed(2)} CAD (Taux de change non configuré)`;

        const rateInfo =
            exchangeRate !== null
                ? `Taux de change: 1 CAD = ${exchangeRate.toLocaleString()} BIF`
                : `Taux de change: Non configuré - Veuillez contacter l'administration`;

        const emailText = `
Cher(e) ${user.firstName} ${user.lastName},

Merci d'avoir utilisé Gisabo Transfert d'argent.
Vous trouverez ci-dessous les détails de votre transaction.

Cordialement,
L'équipe Gisabo

INFORMATIONS EXPÉDITEUR
Nom et Prénom(s): ${user.firstName} ${user.lastName}
E-mail: ${user.email}
Téléphone: ${user.username}

INFORMATIONS BÉNÉFICIAIRE
Nom et Prénom(s): ${transfer.recipientName}
Téléphone: ${transfer.recipientPhone}

INFORMATIONS DE TRANSACTION
Numéro REF: ${refNumber}
${amountInfo}
${rateInfo}
Mode livraison: ${transfer.deliveryMethod}
${transfer.bankName ? `Nom de la banque: ${transfer.bankName}` : ""}
${transfer.accountNumber ? `Numéro de compte: ${transfer.accountNumber}` : ""}
ID Paiement Square: ${paymentId}
Relevé sur carte bancaire: SQ*Gisabo Transfer

Gisabo Group - Votre partenaire de confiance pour les transferts d'argent
Contact: info@gisabogroup.ca | www.gisabogroup.ca
    `;

        // Envoi de l'email au client
        await transporter.sendMail({
            from: `TRANSFERT GISABO <${FROM_EMAIL}>`,
            to: user.email,
            subject: `Confirmation de transfert Gisabo - ${refNumber}`,
            text: emailText,
            html: emailHTML,
        });

        // Envoi d'une copie à l'administrateur
        await transporter.sendMail({
            from: `TRANSFERT GISABO <${FROM_EMAIL}>`,
            to: [ADMIN_EMAIL, "yeoyedjande@gmail.com"],
            subject: `Nouveau transfert - ${refNumber} - ${user.firstName} ${user.lastName}`,
            text: `NOUVEAU TRANSFERT EFFECTUÉ\n\n${emailText}`,
            html: emailHTML,
        });

        console.log(
            `✅ Emails de confirmation envoyés pour le transfert ${refNumber}`,
        );
        return true;
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email:", error);
        return false;
    }
}

export async function sendOrderConfirmationEmail(
    order: Order,
    user: User,
    orderItems: any[],
    paymentId: string,
): Promise<boolean> {
    try {
        // Générer le numéro de commande formaté
        const orderNumber = `CMD-${order.id.toString().padStart(6, "0")}`;

        // Calculer les détails
        const itemsHTML = orderItems
            .map(
                (item) => `
      <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0; color: #333;">${item.product?.name || "Produit"}</h4>
            <p style="margin: 5px 0; color: #666;">Quantité: ${item.quantity}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-weight: bold; color: #2E8B57;">
              ${parseFloat(item.price).toFixed(2)} ${order.currency}
            </p>
          </div>
        </div>
      </div>
    `,
            )
            .join("");

        const itemsText = orderItems
            .map(
                (item) =>
                    `${item.product?.name || "Produit"} - Quantité: ${item.quantity} - ${parseFloat(item.price).toFixed(2)} ${order.currency}`,
            )
            .join("\n");

        // Informations du bénéficiaire
        const shippingInfo = order.shippingAddress as any;

        // Template d'email HTML
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation d'achat - Gisabo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #1e3a8a; }
        .section h3 { margin-top: 0; color: #1e3a8a; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; }
        .footer { background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .total-highlight { background: #e1f5fe; padding: 15px; border-radius: 5px; text-align: center; font-size: 20px; font-weight: bold; color: #1e3a8a; margin: 15px 0; }
        .status-badge { background: #4caf50; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Achat Gisabo </h1>
            <p>Confirmation d'achat</p>
        </div>
        
        <div class="content">
            <p><strong>Cher(e) ${user.firstName} ${user.lastName},</strong></p>
            <p>Merci pour votre achat sur Gisabo. Votre commande a été confirmée et sera traitée dans les plus brefs délais.</p>
            
            <div class="section">
                <h3>📦 Détails de la commande</h3>
                <div class="info-row">
                    <span class="label">Numéro de commande:</span>
                    <span><strong>${orderNumber}</strong></span>
                </div>
                <div class="info-row">
                    <span class="label">Date:</span>
                    <span>${new Date(order.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        },
                    )}</span>
                </div>
                <div class="info-row">
                    <span class="label">Statut:</span>
                    <span><span class="status-badge">Payé</span></span>
                </div>
            </div>

            <div class="section">
                <h3>🛍️ Produits commandés</h3>
                ${itemsHTML}
                <div class="total-highlight">
                    Total payé: ${parseFloat(order.total).toFixed(2)} ${order.currency}
                </div>
            </div>

            <div class="section">
                <h3>👤 Informations bénéficiaire</h3>
                <div class="info-row">
                    <span class="label">Nom et prénom:</span>
                    <span>${shippingInfo.firstName} ${shippingInfo.lastName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Téléphone:</span>
                    <span>${shippingInfo.phone}</span>
                </div>
                ${
                    shippingInfo.note
                        ? `
                <div class="info-row">
                    <span class="label">Note:</span>
                    <span>${shippingInfo.note}</span>
                </div>
                `
                        : ""
                }
            </div>

            <div class="section">
                <h3>💳 Informations de paiement</h3>
                <div class="info-row">
                    <span class="label">ID Transaction:</span>
                    <span>${paymentId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Relevé bancaire:</span>
                    <span>SQ*Gisabo Marketplace</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Gisabo Group</strong> - Votre marketplace de confiance</p>
            <p>📧 Contact: info@gisabogroup.ca | 🌐 www.gisabogroup.ca</p>
        </div>
    </div>
</body>
</html>
    `;

        const emailText = `
Cher(e) ${user.firstName} ${user.lastName},

Merci pour votre achat sur Gisabo Marketplace. Votre commande a été confirmée et sera traitée dans les plus brefs délais.

DÉTAILS DE LA COMMANDE
Numéro de commande: ${orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString("fr-FR")}
Statut: Payé

PRODUITS COMMANDÉS
${itemsText}

Total payé: ${parseFloat(order.total).toFixed(2)} ${order.currency}

INFORMATIONS BÉNÉFICIAIRE
Nom et prénom: ${shippingInfo.firstName} ${shippingInfo.lastName}
Téléphone: ${shippingInfo.phone}
${shippingInfo.note ? `Note: ${shippingInfo.note}` : ""}

INFORMATIONS DE PAIEMENT
ID Transaction: ${paymentId}
Relevé bancaire: SQ*Coop Arcade

Gisabo Group - Votre marketplace de confiance
Contact: info@gisabogroup.ca | www.gisabogroup.ca
    `;

        // Envoi de l'email au client
        await transporter.sendMail({
            from: `ACHAT GISABO <${FROM_EMAIL}>`,
            to: user.email,
            subject: `Confirmation d'achat Gisabo - ${orderNumber}`,
            text: emailText,
            html: emailHTML,
        });

        // Envoi d'une copie à l'administrateur
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: [ADMIN_EMAIL, "yeoyedjande@gmail.com"],
            subject: `Nouvelle commande - ${orderNumber} - ${user.firstName} ${user.lastName}`,
            text: `NOUVELLE COMMANDE EFFECTUÉE\n\n${emailText}`,
            html: emailHTML,
        });

        console.log(
            `✅ Emails de confirmation envoyés pour la commande ${orderNumber}`,
        );
        return true;
    } catch (error) {
        console.error(
            "❌ Erreur lors de l'envoi de l'email de commande:",
            error,
        );
        return false;
    }
}

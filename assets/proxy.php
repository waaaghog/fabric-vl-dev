<?php
require_once __DIR__ . '/config/data.php';

/*
Response from GET /api/companies/{companyId}/customers/byNumber/{customerNumber}:
	{
	"@odata.context": "https://api.businesscentral.dynamics.com/v2.0/4dce5d10-423a-4751-853d-87a94251ab65/Production/api/vc/common/v1.0/$metadata#companies(6c5383a3-4f5c-f111-ab09-002248b75509)/customerFulls/$entity",
	"@odata.etag": "W/\"JzE5OzE0NTgwODY4OTg4NjU4MDIwNjMxOzAwOyc=\"",
	"SystemId": "46274b22-e465-f111-ab09-7ced8db899e9",
	"No": "C0045906",
	"SystemModifiedAt": "2026-06-18T21:50:52.497Z",
	"Phone2": "",
	"Contact2": "",
	"No2": "",
	"CreationDate": "0001-01-01",
	"PermitStatus": "UNKNOWN",
	"PermitResults": "",
	"PermitLastCheckDate": "",
	"PermitLastCheckTime": "",
	"Mobile": "",
	"DefaultCreditCardCode": "",
	"Status": "Active",
	"CustomerShippingAccountNo": "",
	"LastInvoiceDate": "0001-01-01",
	"Alert": "",
	"CreationSource": "",
	"CustomerSourceCategory": "",
	"CustomerSourceGroup": "",
	"CustomerGroup": "",
	"CustomerType": "042",
	"PreferredLanguage": "English",
	"AboRetailerId": "",
	"aboStoreId": "70189194",
	"ParentNo": "",
	"B2BElevatorAccessCode": "",
	"shopifyMarketHandle": "CRICKET-WIRELESS",
	"nsInternalId": 0,
	"parentCustomerNo": "C0016843",
	"masterAgent": "",
	"dealerId": "",
	"storeType": "",
	"doorType": "",
	"longName": "",
	"salesForceId": "",
	"doorLocationId": "",
	"dealerProfile": "",
	"parentProfile": "",
	"entityStage": "",
	"posDealerId": "",
	"entityStatus": "",
	"ipopDealerId": "",
	"boostAccountId": "",
	"showNetPaymentOnWeb": false,
	"externalPMID": 0,
	"externalCOID": 0,
	"isDealer": false,
	"Name": "PQH WIRELESS",
	"SearchName": "PQH WIRELESS",
	"Name2": "",
	"Address": "402 SE 9th Ave",
	"Address2": "",
	"City": "HILLSBORO",
	"Contact": "Allan T, Ashley N",
	"PhoneNo": "5033525264",
	"TelexNo": "",
	"DocumentSendingProfile": "",
	"ShiptoCode": "",
	"OurAccountNo": "",
	"TerritoryCode": "",
	"GlobalDimension1Code": "",
	"GlobalDimension2Code": "",
	"ChainName": "",
	"BudgetedAmount": 0,
	"CreditLimitLCY": 0,
	"CustomerPostingGroup": "ALL",
	"CurrencyCode": "",
	"CustomerPriceGroup": "PT2",
	"LanguageCode": "",
	"RegistrationNumber": "",
	"StatisticsGroup": 0,
	"PaymentTermsCode": "NET 60",
	"FinChargeTermsCode": "",
	"SalespersonCode": "VNC",
	"ShipmentMethodCode": "",
	"ShippingAgentCode": "",
	"PlaceofExport": "",
	"InvoiceDiscCode": "C0045906",
	"CustomerDiscGroup": "",
	"CountryRegionCode": "US",
	"CollectionMethod": "",
	"Amount": 0,
	"Comment": false,
	"Blocked": "_x0020_",
	"LastStatementNo": 0,
	"PrintStatements": false,
	"BilltoCustomerNo": "",
	"Priority": 0,
	"PaymentMethodCode": "ACH",
	"FormatRegion": "",
	"FirstTransactionDate": "2026-06-17",
	"LastModifiedDateTime": "2026-06-18T21:50:52.493Z",
	"LastDateModified": "2026-06-18",
	"Balance": 672.1,
	"BalanceLCY": 672.1,
	"NetChange": 672.1,
	"NetChangeLCY": 672.1,
	"SalesLCY": 672.1,
	"ProfitLCY": 233.4,
	"InvDiscountsLCY": 0,
	"PmtDiscountsLCY": 0,
	"BalanceDue": 672.1,
	"BalanceDueLCY": 672.1,
	"Payments": 0,
	"InvoiceAmounts": 672.1,
	"CrMemoAmounts": 0,
	"FinanceChargeMemoAmounts": 0,
	"PaymentsLCY": 0,
	"InvAmountsLCY": 672.1,
	"CrMemoAmountsLCY": 0,
	"FinChargeMemoAmountsLCY": 0,
	"OutstandingOrders": 0,
	"ShippedNotInvoiced": 0,
	"ApplicationMethod": "Manual",
	"PricesIncludingVAT": false,
	"LocationCode": "H",
	"FaxNo": "",
	"TelexAnswerBack": "",
	"VATRegistrationNo": "",
	"CombineShipments": false,
	"GenBusPostingGroup": "ALL",
	"GLN": "",
	"PostCode": "97123",
	"County": "OR",
	"EORINumber": "",
	"UseGLNinElectronicDocument": false,
	"DebitAmount": 672.1,
	"CreditAmount": 0,
	"DebitAmountLCY": 672.1,
	"CreditAmountLCY": 0,
	"EMail": "hillsboro@ringringwireless.com",
	"ReminderTermsCode": "",
	"ReminderAmounts": 0,
	"ReminderAmountsLCY": 0,
	"NoSeries": "CUST",
	"TaxAreaCode": "",
	"TaxLiable": false,
	"VATBusPostingGroup": "",
	"OutstandingOrdersLCY": 0,
	"ShippedNotInvoicedLCY": 0,
	"Reserve": "Optional",
	"BlockPaymentTolerance": false,
	"PmtDiscToleranceLCY": 0,
	"PmtToleranceLCY": 0,
	"ICPartnerCode": "",
	"Refunds": 0,
	"RefundsLCY": 0,
	"OtherAmounts": 0,
	"OtherAmountsLCY": 0,
	"Prepayment": 0,
	"OutstandingInvoicesLCY": 0,
	"OutstandingInvoices": 0,
	"BilltoNoOfArchivedDoc": 1,
	"SelltoNoOfArchivedDoc": 1,
	"PartnerType": "_x0020_",
	"IntrastatPartnerType": "_x0020_",
	"ExcludefromPmtPractices": false,
	"Image": "00000000-0000-0000-0000-000000000000",
	"PrivacyBlocked": false,
	"DisableSearchbyName": false,
	"AllowMultiplePostingGroups": false,
	"PreferredBankAccountCode": "",
	"CoupledtoDataverse": false,
	"CashFlowPaymentTermsCode": "",
	"PrimaryContactNo": "CT00090632",
	"ContactType": "Company",
	"MobilePhoneNo": "",
	"ResponsibilityCenter": "",
	"ShippingAdvice": "Partial",
	"ShippingTime": "",
	"ShippingAgentServiceCode": "",
	"PriceCalculationMethod": "_x0020_",
	"AllowLineDisc": true,
	"NoofQuotes": 0,
	"NoofBlanketOrders": 0,
	"NoofOrders": 0,
	"NoofInvoices": 0,
	"NoofReturnOrders": 0,
	"NoofCreditMemos": 0,
	"NoofPstdShipments": 1,
	"NoofPstdInvoices": 1,
	"NoofPstdReturnReceipts": 0,
	"NoofPstdCreditMemos": 0,
	"NoofShiptoAddresses": 1,
	"BillToNoofQuotes": 0,
	"BillToNoofBlanketOrders": 0,
	"BillToNoofOrders": 0,
	"BillToNoofInvoices": 0,
	"BillToNoofReturnOrders": 0,
	"BillToNoofCreditMemos": 0,
	"BillToNoofPstdShipments": 1,
	"BillToNoofPstdInvoices": 1,
	"BillToNoofPstdReturnR": 0,
	"BillToNoofPstdCrMemos": 0,
	"BaseCalendarCode": "",
	"CopySelltoAddrtoQteFrom": "Company",
	"ValidateEUVatRegNo": false,
	"CurrencyId": "00000000-0000-0000-0000-000000000000",
	"PaymentTermsId": "f5c44b04-075c-f111-89ec-74563c46eb3f",
	"ShipmentMethodId": "00000000-0000-0000-0000-000000000000",
	"PaymentMethodId": "76c44b04-075c-f111-89ec-74563c46eb3f",
	"TaxAreaID": "00000000-0000-0000-0000-000000000000",
	"ContactID": "00000000-0000-0000-0000-000000000000",
	"ContactGraphId": "",
	"UPSZone": "",
	"TaxExemptionNo": "",
	"BankCommunication": "E English",
	"CheckDateFormat": " ",
	"CheckDateSeparator": " ",
	"BalanceonDate": 672.1,
	"BalanceonDateLCY": 672.1,
	"RFCNo": "",
	"CURPNo": "",
	"StateInscription": "",
	"TaxIdentificationType": "Legal_x0020_Entity",
	"CFDIPurpose": "",
	"CFDIRelation": "",
	"SATTaxRegimeClassification": "",
	"CFDIExportCode": "",
	"CFDIGeneralPublic": false,
	"CFDIPeriod": "Diario",
	"CFDICustomerName": "",
	"freeShippingExcluded": false,
	"freeShippingThresholdLCY": 0,
	"freightMarkupFactor": 0,
	"groundFlatRateLCY": 0,
	"groundRateIsFlatTotal": false
	}
*/
/*
Response from GET /api/companies/{companyId}/posted-sales-invoices/by-customer/{customerNo}/slim:
    {
      "no": "PSI0645176",
      "orderNo": "SO0682779",
      "postingDate": "2022-01-04T00:00:00Z",
      "dueDate": "2022-01-19T00:00:00Z",
      "externalDocumentNo": "PO143666",
      "currencyCode": null,
      "amountIncludingVAT": null,
      "amount": null,
      "remainingAmount": null,
      "subTotal": 866.53,
      "totalAmount": 866.53,
      "totalQuantity": 169,
      "paymentTermsCode": "NET 15",
      "shipToName": "MYCOOLCELL, LLC",
      "shipToAddress": "9722 TOPANGA CANYON BLVD",
      "shipToCity": "CHATSWORTH",
      "shipToCounty": "CA",
      "shipToPostCode": "91311",
      "shipToCountryRegionCode": "US",
      "billToName": "MYCOOLCELL,LLC",
      "sellToCustomerName": "MYCOOLCELL,LLC",
      "billToAddress": "9722 TOPANGA CANYON BLVD",
      "sellToAddress": "9722 TOPANGA CANYON BLVD",
      "billToCity": "CHATSWORTH",
      "sellToCity": "CHATSWORTH",
      "billToCounty": "CA",
      "sellToCounty": "CA",
      "billToPostCode": "91311",
      "sellToPostCode": "91311",
      "billToCountryRegionCode": "US",
      "sellToCountryRegionCode": "US",
      "packageTrackingNo": "",
      "shippingAgentCode": "CUSTOMER",
      "source": "SalesInvoiceHistory"
    },
/*
Response from GET /api/companies/{companyId}/sales-invoice-history
    {
      "@odata.etag": "W/\"JzE5OzIxMzcyNzM2MjM5MDkwNzYxMjAxOzAwOyc=\"",
      "systemId": "9c8b1642-b35c-f111-ab09-7ced8d8acb59",
      "no": "PSI0618307",
      "sellToCustomerNo": "C0001286",
      "billToCustomerNo": "C0001286",
      "billToName": "MYCOOLCELL,LLC",
      "billToName2": "",
      "billToAddress": "9722 TOPANGA CANYON BLVD",
      "billToAddress2": "",
      "billToCity": "CHATSWORTH",
      "billToContact": "ALBERT",
      "shipToCode": "",
      "shipToName": "MYCOOLCELL, LLC",
      "shipToName2": "",
      "shipToAddress": "9722 TOPANGA CANYON BLVD",
      "shipToAddress2": "",
      "shipToCity": "CHATSWORTH",
      "shipToContact": "ALBERT",
      "orderDate": "2021-06-07T00:00:00Z",
      "postingDate": "2021-06-08T00:00:00Z",
      "shipmentDate": "2021-06-08T00:00:00Z",
      "postingDescription": "Order SO0653327",
      "paymentTermsCode": "NET CARD",
      "dueDate": "2021-06-08T00:00:00Z",
      "shipmentMethodCode": "",
      "locationCode": "1",
      "orderNo": "SO0653327",
      "sellToCustomerName": "MYCOOLCELL,LLC",
      "sellToCustomerName2": "",
      "sellToAddress": "9722 TOPANGA CANYON BLVD",
      "sellToAddress2": "",
      "sellToCity": "CHATSWORTH",
      "sellToContact": "ALBERT",
      "billToPostCode": "91311",
      "billToCounty": "CA",
      "billToCountryRegionCode": "US",
      "sellToPostCode": "91311",
      "sellToCounty": "CA",
      "sellToCountryRegionCode": "US",
      "shipToPostCode": "91311",
      "shipToCounty": "CA",
      "shipToCountryRegionCode": "US",
      "documentDate": "2021-06-08T00:00:00Z",
      "externalDocumentNo": "PO139518",
      "paymentMethodCode": "",
      "shippingAgentCode": "CUSTOMER",
      "packageTrackingNo": "",
      "sellToContactNo": "CT00006220",
      "billToContactNo": "CT00006220",
      "freightChargeLCY": 0,
      "subTotal": 31,
      "totalAmount": 31,
      "totalQuantity": 12,
      "shippedPackages": 1,
      "phoneNo": "",
      "websiteOrderDatetime": "0001-01-01T00:00:00Z",
      "customerShippingAccountNo": "",
      "customerShippingAccountType": "",
      "useCustomerShippingAccount": false,
      "nsSplitOrder": false,
      "orderSource": 0,
      "websiteOrderNo": "PO139518",
      "shippingAgentServiceCode": "PICK-UP",
      "combineShipmentIntoSO": "",
      "channel": "",
      "aboStoreId": "",
      "aboRetailerId": "",
      "fromSystem": "NAV",
      "nsInternalId": 0,
      "orderNsInternalId": 0,
      "scanPayOrder": false
    },
*/
/**
 * Valor ERP Proxy
 *
 * Verifies a Shopify HMAC auth token generated in Liquid, then proxies
 * requests to the Business Central API using client-credentials auth.
 *
 * Environment variables required:
 *   SHOPIFY_SECRET	   - shared secret used to sign the Liquid HMAC token
 *						  (store as shop metafield secure.secret, same value here)
 *   ENTRA_TENANT_ID	  - Azure Entra tenant ID
 *   ENTRA_CLIENT_ID	  - App registration client ID
 *   ENTRA_CLIENT_SECRET  - App registration client secret
 *   BC_COMPANY_ID		- Valor BC company GUID (from /api/companies).
 *						  Leave blank to auto-discover on first call.
 *
 * Optional:
 *   BC_ENV			   - 'dev' (default) | 'stg' | 'prod'
 */

// - CORS -
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}

// ── Global request log ───────────────────────────────────────────────────
$_reqInput  = file_get_contents('php://input');
$_reqData   = json_decode($_reqInput, true) ?: [];
$_reqAction = $_reqData['action'] ?? ($_GET['action'] ?? '-');
$_reqIp     = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '-';
$_reqT0     = microtime(true);
error_log('[proxy] action=' . $_reqAction . ' ip=' . $_reqIp . ' t=0.00s start');

// ── Unauthenticated pre-auth actions ─────────────────────────────────────
// These actions do not require a logged-in Shopify customer.

// signup — new partner registration (user may not have a Shopify account yet)
// Called by valor-register.liquid: POST /valor/proxy?action=signup
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_GET['action'] ?? '') === 'signup') {
	$input = file_get_contents('php://input');
	$data  = json_decode($input, true) ?: [];
	$shop  = preg_replace('/[^a-z0-9\-]/', '', strtolower($_GET['shop'] ?? ''));
	if (!$shop) { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'Missing shop']); exit; }
	if (!isset(SHOPIFY_SHOPS[$shop])) {
		http_response_code(403);
		echo json_encode(['ok' => false, 'error' => 'Unknown shop']);
		exit;
	}
	try {
		$result = newCustomer($shop . '.myshopify.com', $data);
		echo json_encode($result);
	} catch (RuntimeException $e) {
		http_response_code(500);
		echo json_encode(['ok' => false, 'error' => 'Registration failed. Please try again or contact support.']);
	}
	exit;
}

// account-issue — existing customer requesting B2B access help
// Called by valor-register-popup.liquid: POST /valor/proxy?action=account-issue
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_GET['action'] ?? '') === 'account-issue') {
	$input = file_get_contents('php://input');
	$data  = json_decode($input, true) ?: [];
	$shop  = preg_replace('/[^a-z0-9\-]/', '', strtolower($data['shop'] ?? ''));
	$email = trim($data['email'] ?? '');
	$msg   = trim($data['message'] ?? '');

	if (!$shop || !isset(SHOPIFY_SHOPS[$shop])) { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'Invalid shop']); exit; }
	if (!$email) { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'Missing email']); exit; }

	$shopCfg = SHOPIFY_SHOPS[$shop];
	$apiUrl  = "https://{$shop}.myshopify.com/admin/api/2026-01/graphql.json";
	$headers = ['Content-Type: application/json', 'X-Shopify-Access-Token: ' . $shopCfg['token']];

	try {
		// Find customer by email
		$findResult = curlJson('POST', $apiUrl, $headers, json_encode([
			'query'     => 'query($q:String!){customers(first:1,query:$q){edges{node{id note tags}}}}',
			'variables' => ['q' => 'email:' . $email],
		]));
		$node = $findResult['data']['customers']['edges'][0]['node'] ?? null;

		if ($node) {
			$existing = trim($node['note'] ?? '');
			$stamp    = '[Access Request ' . date('Y-m-d') . ']';
			$newNote  = ($existing ? $existing . "\n\n" : '') . $stamp . "\nEmail: {$email}" . ($msg ? "\nDetails: {$msg}" : '');
			curlJson('POST', $apiUrl, $headers, json_encode([
				'query'     => 'mutation($id:ID!,$note:String!,$tags:[String!]!){customerUpdate(input:{id:$id,note:$note,tags:$tags}){userErrors{message}}}',
				'variables' => ['id' => $node['id'], 'note' => $newNote, 'tags' => array_unique(array_merge($node['tags'] ?? [], ['access-requested']))],
			]));
		}
		// Always return ok — don't leak whether the email exists
		echo json_encode(['ok' => true]);
	} catch (RuntimeException $e) {
		http_response_code(500);
		echo json_encode(['ok' => false, 'error' => 'Unable to process your request. Please try again.']);
	}
	exit;
}

// variants — public inventory lookup (GET, public inventory data)
// Called by cart-distribution.js: GET /valor/proxy?action=variants&shop={shop}&ids={ids}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['action'] ?? '') === 'variants') {
	$shop = preg_replace('/[^a-z0-9\-]/', '', strtolower($_GET['shop'] ?? ''));
	$ids  = preg_replace('/[^0-9,]/', '', $_GET['ids'] ?? '');
	if (!$shop || !$ids) { echo json_encode([]); exit; }
	$shopCfg = SHOPIFY_SHOPS[$shop] ?? null;
	if (!$shopCfg) { echo json_encode([]); exit; }

	$vid_a   = 'gid://shopify/ProductVariant/' . str_replace(',', ',gid://shopify/ProductVariant/', $ids);
	$gql     = <<<'GRAPHQL'
		query VariantsQuantityAvailable($vids: [ID!]!) {
		  nodes(ids: $vids) {
			__typename
			... on ProductVariant {
				id title sku price compareAtPrice
				inventoryQuantity sellableOnlineQuantity
				metafield(key: "volume_pricing") { type value }
			}
		  }
		}
GRAPHQL;

	$url = "https://{$shop}.myshopify.com/admin/api/2026-01/graphql.json";
	try {
		$response = curlJson('POST', $url, [
			'Content-Type: application/json',
			'X-Shopify-Access-Token: ' . $shopCfg['token'],
			'Accept: application/json',
		], json_encode([
			'query'     => $gql,
			'variables' => ['vids' => explode(',', $vid_a)],
		]));
	} catch (RuntimeException $e) {
		echo json_encode([]);
		exit;
	}

	if (isset($response['errors'])) {
		echo json_encode([]);
		exit;
	}

	$variants = [];
	foreach (($response['data']['nodes'] ?? []) as $node) {
		if (($node['__typename'] ?? null) !== 'ProductVariant') continue;
		$variants[] = [
			'id'        => str_replace('gid://shopify/ProductVariant/', '', $node['id']),
			'title'     => $node['title'],
			'sku'       => $node['sku'],
			'inventory' => $node['inventoryQuantity'],
			'available' => $node['sellableOnlineQuantity'],
			'vol_price' => json_encode($node['metafield'] ?? []),
		];
	}
	echo json_encode($variants);
	exit;
}

// - Helpers -
function jsonErr(string $msg, int $code = 400): void
{
	// Always return HTTP 200 — nginx intercepts 4xx FastCGI responses and replaces them
	// with its own error pages, stripping the PHP CORS headers. The real error is in the body.
	http_response_code(200);
	echo json_encode(['ok' => false, 'error' => $msg]);
	exit;
}

function curlJson(string $method, string $url, array $headers, ?string $body = null, int $timeout = 30): array
{
	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER	 => $headers,
		CURLOPT_TIMEOUT		=> $timeout,
	]);
	if ($method === 'POST') {
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
	} elseif ($method !== 'GET') {
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
		if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
	}
	$raw	  	= curl_exec($ch);
	$errno		= curl_errno($ch);
	$info     	= curl_getinfo($ch);
	$httpCode 	= $info[CURLINFO_HTTP_CODE] ?? $info['http_code'];
	curl_close($ch);
	if (($info['total_time'] ?? 0) > 2) {
		error_log(sprintf(
			'[curlJson] slow url=%s total=%.2fs dns=%.2fs tcp=%.2fs tls=%.2fs ttfb=%.2fs transfer=%.2fs bytes=%d',
			preg_replace('/^(https?:\/\/[^\/]+).*/', '$1...', $url),
			$info['total_time'],
			$info['namelookup_time'],
			$info['connect_time'] - $info['namelookup_time'],
			$info['pretransfer_time'] - $info['connect_time'],
			$info['starttransfer_time'] - $info['pretransfer_time'],
			$info['total_time'] - $info['starttransfer_time'],
			$info['size_download'] ?? 0
		));
	}

	if ($errno === CURLE_OPERATION_TIMEDOUT) {
		throw new RuntimeException('__TIMEOUT__');
	}
	if ($errno) {
		throw new RuntimeException('Connection error. Please try again.');
	}
	$data = json_decode($raw, true) ?? [];
	if ($httpCode >= 400) {
		//error_log("[proxy] curlJson error: $method $url | HTTP $httpCode | raw: " . substr($raw, 0, 2000));
		if ($httpCode >= 500) {
			throw new RuntimeException('Service temporarily unavailable. Please try again.');
		}
		if (isset($data['errors']) && is_array($data['errors'])) {
			// ShipStation/ShipEngine: errors is an array of objects with a 'message' key
			$firstErr = array_values($data['errors'])[0] ?? null;
			if (is_array($firstErr) && isset($firstErr['message'])) {
				$msg = $firstErr['message'];
			} else {
				// Shopify/other: errors is a keyed object or array of strings
				$firstKey = array_key_first($data['errors']);
				$firstVal = $data['errors'][$firstKey];
				$firstMsg = is_array($firstVal) ? ($firstVal['message'] ?? $firstVal[0] ?? '') : $firstVal;
				$msg = ($data['title'] ?? 'Validation error') . ': ' . $firstMsg;
			}
		} else {
			$msg = $data['message'] ?? $data['detail'] ?? $data['title'] ?? $data['description'] ?? $data['error_description'] ?? $data['error'] ?? $raw;
		}
		throw new RuntimeException($msg);
	}
	return $data;
}

// - 1. Parse & verify Shopify HMAC -
$input = file_get_contents('php://input');
$body  = json_decode($input, true);
if (!$body) jsonErr('Invalid JSON body');

$customerId = trim((string)($body['customer_id'] ?? ''));
$ts         = (string)($body['ts'] ?? '');
$authToken  = (string)($body['token'] ?? '');
$shopParam  = trim((string)($body['shop'] ?? ''));
$shopName   = str_replace('.myshopify.com', '', $shopParam);
$action     = (string)($body['action'] ?? 'customer-info');

if (!$customerId || !$ts || !$authToken)
	jsonErr('Missing auth fields', 401);
if (!SHOPIFY_SECRET)
	jsonErr('Server misconfigured: SHOPIFY_SECRET not set', 500);

/*/ --- Debug action: verify HMAC computation without running full request ---
// Call with action=debug-auth to check what the server computes vs. what was sent.
// Remove this block before go-live.
if ($action === 'debug-auth') {
	$computed = hash_hmac('sha256', "{$customerId}|{$ts}", SHOPIFY_SECRET);
	$age      = time() - (int)$ts;
	echo json_encode([
		'ok'             => true,
		'hmac_match'     => hash_equals($computed, $authToken),
		'computed_hmac'  => $computed,
		'received_token' => $authToken,
		'message_signed' => "{$customerId}|{$ts}",
		'age_seconds'    => $age,
		'age_ok'         => abs($age) <= AUTH_WINDOW,
		'auth_window'    => AUTH_WINDOW,
		'server_time'    => time(),
		'secret_preview' => substr(SHOPIFY_SECRET, 0, 4) . str_repeat('*', strlen(SHOPIFY_SECRET) - 4),
	]);
	exit;
}*/

// Resolve shop config — by myshopify name if provided, otherwise by the request's host domain.
if ($shopName) {
	$shopCfg = SHOPIFY_SHOPS[$shopName] ?? null;
} else {
	$host    = parse_url($_SERVER['HTTP_REFERER'] ?? '', PHP_URL_HOST) ?: $_SERVER['HTTP_HOST'];
	$shopCfg = null;
	foreach (SHOPIFY_SHOPS as $name => $cfg) {
		if ($cfg['domain'] === $host) { $shopName = $name; $shopCfg = $cfg; break; }
	}
}
if (!$shopCfg) jsonErr('Shop not found', 404);

define('SHOPIFY_DOMAIN',      $shopName . '.myshopify.com');
define('SHOPIFY_ADMIN_TOKEN', $shopCfg['token']);

$expected = hash_hmac('sha256', "{$customerId}|{$ts}", SHOPIFY_SECRET);
if (!hash_equals($expected, $authToken))
	jsonErr('Unauthorized', 401);
if (abs(time() - (int)$ts) > AUTH_WINDOW)
	jsonErr('Auth token expired - reload the page', 401);

// - 2a. ShipStation API token (file-cached, ~1 hour) -
function getSsToken(): string
{
	if (file_exists(SS_TOKEN_CACHE)) {
		$cache = json_decode(file_get_contents(SS_TOKEN_CACHE), true);
		if (!empty($cache['token']) && ($cache['expires_at'] ?? 0) > time() + 60)
			return $cache['token'];
	}

	$data = curlJson('POST',
		'https://login.microsoftonline.com/' . TENANT_ID . '/oauth2/v2.0/token',
		['Content-Type: application/x-www-form-urlencoded'],
		http_build_query([
			'grant_type'    => 'client_credentials',
			'client_id'     => CLIENT_ID,
			'client_secret' => SS_CLIENT_SECRET,
			'scope'         => SS_SCOPE,
		])
	);

	if (empty($data['access_token']))
		throw new RuntimeException('SS token response missing access_token');

	file_put_contents(SS_TOKEN_CACHE, json_encode([
		'token'      => $data['access_token'],
		'expires_at' => time() + (int)($data['expires_in'] ?? 3600) - 60,
	]));

	return $data['access_token'];
}

// - 2. BC access token (file-cached, ~1 hour) -
function getBcToken(): string
{
	if (file_exists(TOKEN_CACHE)) {
		$cache = json_decode(file_get_contents(TOKEN_CACHE), true);
		if (!empty($cache['token']) && $cache['expires_at'] > time() + 60) {
			return $cache['token'];
		}
	}

	$url  = 'https://login.microsoftonline.com/' . TENANT_ID . '/oauth2/v2.0/token';
	$data = curlJson('POST', $url,
		['Content-Type: application/x-www-form-urlencoded'],
		http_build_query([
			'grant_type'	=> 'client_credentials',
			'client_id'		=> CLIENT_ID,
			'client_secret' => CLIENT_SECRET,
			'scope'			=> BC_SCOPE,
		])
	);

	if (empty($data['access_token'])) {
		throw new RuntimeException('Token response missing access_token');
	}

	//error_log('[proxy] getBcToken: fresh token fetched, expires_in=' . ($data['expires_in'] ?? '?') . ' prefix=' . substr($data['access_token'], 0, 20));
	file_put_contents(TOKEN_CACHE, json_encode([
		'token'	  => $data['access_token'],
		'expires_at' => time() + (int)($data['expires_in'] ?? 300) - 60,
	]));

	return $data['access_token'];
}

// - 2b. Payment Gateway access token (file-cached, ~1 hour) -
function getGwToken(): string
{
	if (file_exists(GW_TOKEN_CACHE)) {
		$cache = json_decode(file_get_contents(GW_TOKEN_CACHE), true);
		if (!empty($cache['token']) && $cache['expires_at'] > time() + 60) {
			return $cache['token'];
		}
	}

	$url  = 'https://login.microsoftonline.com/' . TENANT_ID . '/oauth2/v2.0/token';
	$data = curlJson('POST', $url,
		['Content-Type: application/x-www-form-urlencoded'],
		http_build_query([
			'grant_type'    => 'client_credentials',
			'client_id'     => CLIENT_ID,
			'client_secret' => CLIENT_SECRET,
			'scope'         => GW_SCOPE,
		])
	);

	if (empty($data['access_token'])) {
		throw new RuntimeException('GW token response missing access_token');
	}

	file_put_contents(GW_TOKEN_CACHE, json_encode([
		'token'      => $data['access_token'],
		'expires_at' => time() + (int)($data['expires_in'] ?? 300) - 60,
	]));

	return $data['access_token'];
}

// - 3. BC API GET helper -
//
// Builds query string preserving literal $ in OData param names ($filter, $select, etc.)
// http_build_query() would encode $ as %24 which some API gateways don't decode correctly.
function bcGet(string $bcToken, string $path, array $query = []): array
{
	$url = BC_BASE_URL . $path;
	if ($query) {
		$parts = [];
		foreach ($query as $k => $v) {
			$parts[] = $k . '=' . rawurlencode((string)$v);
		}
		$url .= '?' . implode('&', $parts);
	}

	return curlJson('GET', $url, [
		'Authorization: Bearer ' . $bcToken,
		'Accept: application/json',
	]);
}

// - 4. Look up ERP customer number via Shopify Admin API -
//
// Uses the trusted $customerId (verified by HMAC above) to query the customer's
// B2B company externalId - the BC customer number (e.g. C0067900).
// The frontend never supplies this value; it is always fetched server-side.
function getErpNo(string $customerId): string
{
	$gid   = 'gid://shopify/Customer/' . $customerId;
	$query = json_encode([
		'query' => '{
			customer(id: ' . json_encode($gid) . ') {
				companyContactProfiles {
					id
					company {
						id externalId }
				}
			}
		}',
	]);

	$data = curlJson(
		'POST',
		'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
		[
			'Content-Type: application/json',
			'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN,
		],
		$query
	);

	if (!empty($data['errors']))
		throw new RuntimeException('GraphQL error: ' . $data['errors'][0]['message']);
	$externalId = $data['data']['customer']['companyContactProfiles'][0]['company']['externalId'] ?? '';
	if (!$externalId) {
		throw new RuntimeException('No B2B company external ID found for this customer.');
	}
	return $externalId;
}

// - 5. Resolve BC company GUID -
function getBcCompanyId(string $bcToken): string
{
	if (BC_COMPANY_ID) return BC_COMPANY_ID;

	// Auto-discover: first company in the BC tenant
	$result = bcGet($bcToken, '/api/companies');
	$id = $result['value'][0]['id'] ?? '';
	if (!$id)
		throw new RuntimeException('No BC companies returned from /api/companies');
	return $id;
}

// - 5b. Fetch ship-to addresses for an org: cached endpoint with live fallback if empty -
//Changed to verify address because the /posted-sales-invoices/by-customer/$erpNo/slim endpoint doesn't include sellto/billto customer number, so there is no way to verify with them.
function getOrgShipToAddresses(string $erpNo, array $headers): array
{
	$ar = curlJson('GET',
		BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
			. '/ship-to-addresses/cached/byCustomerNumber/' . rawurlencode($erpNo),
		$headers
	);
	if (empty($ar['value'])) {
		$ar = curlJson('GET',
			BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
				. '/ship-to-addresses/byCustomerNumberIncludingChildren/' . rawurlencode($erpNo),
			$headers
		);
	}
	// Normalize PascalCase keys to camelCase so callers don't need dual-case lookups
	return array_map(function(array $r): array {
		if (isset($r['CustomerNo']) && !isset($r['customerNo'])) $r['customerNo'] = $r['CustomerNo'];
		if (isset($r['SystemId'])   && !isset($r['systemId']))   $r['systemId']   = $r['SystemId'];
		if (isset($r['Code'])       && !isset($r['code']))       $r['code']       = $r['Code'];
		return $r;
	}, array_filter($ar['value'] ?? [], 'is_array'));
}

// - 5c. Build a set of all customer numbers in this user's org (parent + children) -
function getOrgCustomerNos(string $erpNo, array $headers): array
{
	$nos = [$erpNo => true];
	try {
		foreach (getOrgShipToAddresses($erpNo, $headers) as $r) {
			$cno = $r['customerNo'] ?? '';
			if ($cno) $nos[$cno] = true;
		}
	} catch (RuntimeException $e) { /* fallback: direct-only */ }
	return $nos;
}

// - 5d. Invoice ownership check — direct match or org membership -
function verifyInvoiceAccess(string $invSellTo, string $invBillTo, string $erpNo, array $headers): void
{
	if ($invSellTo === $erpNo || $invBillTo === $erpNo) return; // direct match — OK
	$orgNos = getOrgCustomerNos($erpNo, $headers);
	if (!isset($orgNos[$invSellTo]) && !isset($orgNos[$invBillTo]))
		jsonErr('Invoice not found', 403);
}

function verifyOrderAccess(string $orderCustNo, string $erpNo, array $headers): void
{
	if ($orderCustNo === $erpNo) return; // direct match — OK
	$orgNos = getOrgCustomerNos($erpNo, $headers);
	if (!isset($orgNos[$orderCustNo]))
		jsonErr('Order not found', 403);
}

// - 5e. New customer registration → Azure webhook -
function newCustomer(string $shopDomain, array $data): array
{
	$webhookUrls = [
		'dev'  => 'https://valor-func-con-shopify-b2b-dev.azurewebsites.net/api/webhooks/shopify/b2b/user-registration',
		'stg'  => 'https://valor-func-con-shopify-b2b-stg.azurewebsites.net/api/webhooks/shopify/b2b/user-registration',
		'prod' => 'https://valor-func-con-shopify-b2b-prod.azurewebsites.net/api/webhooks/shopify/b2b/user-registration',
	];
	$webhookKeys = [
		'dev'  => 'abefdf981ec7285acb323b51d49a895a8ddfd92c186de3710fa7691f188e2e8a', //dev-valorcomm
		'stg'  => '91ef59c29f7d3efdbaeacd28d898dec2ce465a764b5cd8d50bbc12a35d194938', //valor-mybat
		'prod' => '91ef59c29f7d3efdbaeacd28d898dec2ce465a764b5cd8d50bbc12a35d194938', //valor-mybat
		//'prod' => '54c0438865ec0a76efa7585a6b2217466f85b8599a14392a732e525de7e54fc7', //valorcomm
	];

	static $countries = [
		'United States' => 'US', 'United States of America' => 'US',
		'Canada' => 'CA', 'United Kingdom' => 'GB', 'Great Britain' => 'GB',
		'Australia' => 'AU', 'New Zealand' => 'NZ', 'Germany' => 'DE',
		'France' => 'FR', 'Italy' => 'IT', 'Spain' => 'ES', 'Netherlands' => 'NL',
		'Belgium' => 'BE', 'Sweden' => 'SE', 'Norway' => 'NO', 'Denmark' => 'DK',
		'Switzerland' => 'CH', 'Austria' => 'AT', 'Poland' => 'PL', 'Portugal' => 'PT',
		'Ireland' => 'IE', 'Japan' => 'JP', 'China' => 'CN', 'South Korea' => 'KR',
		'Korea' => 'KR', 'India' => 'IN', 'Singapore' => 'SG', 'Hong Kong' => 'HK',
		'Taiwan' => 'TW', 'Malaysia' => 'MY', 'Philippines' => 'PH', 'Indonesia' => 'ID',
		'Thailand' => 'TH', 'Vietnam' => 'VN', 'Israel' => 'IL',
		'United Arab Emirates' => 'AE', 'UAE' => 'AE', 'Saudi Arabia' => 'SA',
		'Mexico' => 'MX', 'Guatemala' => 'GT', 'Belize' => 'BZ', 'Honduras' => 'HN',
		'El Salvador' => 'SV', 'Nicaragua' => 'NI', 'Costa Rica' => 'CR', 'Panama' => 'PA',
		'Cuba' => 'CU', 'Jamaica' => 'JM', 'Haiti' => 'HT', 'Dominican Republic' => 'DO',
		'Trinidad and Tobago' => 'TT', 'Trinidad & Tobago' => 'TT', 'Barbados' => 'BB',
		'Bahamas' => 'BS', 'Colombia' => 'CO', 'Venezuela' => 'VE', 'Ecuador' => 'EC',
		'Peru' => 'PE', 'Bolivia' => 'BO', 'Chile' => 'CL', 'Argentina' => 'AR',
		'Brazil' => 'BR',
	];
	static $states = [
		'Alabama' => 'AL', 'Alaska' => 'AK', 'Arizona' => 'AZ', 'Arkansas' => 'AR',
		'California' => 'CA', 'Colorado' => 'CO', 'Connecticut' => 'CT', 'Delaware' => 'DE',
		'District of Columbia' => 'DC', 'Florida' => 'FL', 'Georgia' => 'GA', 'Hawaii' => 'HI',
		'Idaho' => 'ID', 'Illinois' => 'IL', 'Indiana' => 'IN', 'Iowa' => 'IA',
		'Kansas' => 'KS', 'Kentucky' => 'KY', 'Louisiana' => 'LA', 'Maine' => 'ME',
		'Maryland' => 'MD', 'Massachusetts' => 'MA', 'Michigan' => 'MI', 'Minnesota' => 'MN',
		'Mississippi' => 'MS', 'Missouri' => 'MO', 'Montana' => 'MT', 'Nebraska' => 'NE',
		'Nevada' => 'NV', 'New Hampshire' => 'NH', 'New Jersey' => 'NJ', 'New Mexico' => 'NM',
		'New York' => 'NY', 'North Carolina' => 'NC', 'North Dakota' => 'ND', 'Ohio' => 'OH',
		'Oklahoma' => 'OK', 'Oregon' => 'OR', 'Pennsylvania' => 'PA', 'Rhode Island' => 'RI',
		'South Carolina' => 'SC', 'South Dakota' => 'SD', 'Tennessee' => 'TN', 'Texas' => 'TX',
		'Utah' => 'UT', 'Vermont' => 'VT', 'Virginia' => 'VA', 'Washington' => 'WA',
		'West Virginia' => 'WV', 'Wisconsin' => 'WI', 'Wyoming' => 'WY',
	];

	$country = $countries[ucwords(strtolower($data['bill_country'] ?? ''))] ?? ($data['bill_country'] ?? 'US');
	$state   = $states[ucwords(strtolower($data['bill_state']   ?? ''))] ?? ($data['bill_state']   ?? '');

	// Shipping: if ship_address1 is empty, billing doubles as shipping
	$useBillingAsShipping = empty($data['ship_address1']);
	$shipCountry = $useBillingAsShipping ? $country
		: ($countries[ucwords(strtolower($data['ship_country'] ?? ''))] ?? ($data['ship_country'] ?? 'US'));
	$shipState = $useBillingAsShipping ? $state
		: ($states[ucwords(strtolower($data['ship_state'] ?? ''))] ?? ($data['ship_state'] ?? ''));

	$payload = json_encode([
		'shopifyUserId'         => $data['shopify_user_id'] ?? '',
		'firstName'             => $data['first_name']      ?? '',
		'lastName'              => $data['last_name']       ?? '',
		'email'                 => $data['contact_email']   ?? $data['email'] ?? '',
		'phoneNo'               => $data['phone']           ?? '',
		'roleTitle'             => $data['role_title']      ?? '',
		'contactPerson'         => $data['contact_person']  ?? '',
		'masterAgent'           => $data['master_agent']    ?? '',
		'referralCode'          => $data['referral_code']   ?? '',
		'companyName'           => $data['company_name']    ?? '',
		'website'               => $data['website']         ?? '',
		'businessTypeCode'      => $data['business_type_code'] ?? '',
		'businessTypeComments'  => $data['business_type_comments'] ?? '',
		'numberOfLocations'     => (int)($data['number_of_locations'] ?? 0),
		'estimatedMonthlySpend' => $data['estimated_monthly_spend'] ?? '',
		'currentVendors'        => $data['current_vendors'] ?? '',
		'howDidYouHear'         => $data['how_did_you_hear'] ?? '',
		'billingAddressLine1'   => $data['bill_address1']  ?? '',
		'billingAddressLine2'   => $data['bill_address2']  ?? '',
		'billingCity'           => $data['bill_city']      ?? '',
		'billingStateProvince'  => $state,
		'billingZipCode'        => $data['bill_zip']       ?? '',
		'billingCountry'        => $country,
		'shippingAddressLine1'  => $useBillingAsShipping ? ($data['bill_address1'] ?? '') : ($data['ship_address1'] ?? ''),
		'shippingAddressLine2'  => $useBillingAsShipping ? ($data['bill_address2'] ?? '') : ($data['ship_address2'] ?? ''),
		'shippingCity'          => $useBillingAsShipping ? ($data['bill_city'] ?? '') : ($data['ship_city'] ?? ''),
		'shippingStateProvince' => $useBillingAsShipping ? $state : $shipState,
		'shippingZipCode'       => $useBillingAsShipping ? ($data['bill_zip'] ?? '') : ($data['ship_zip'] ?? ''),
		'shippingCountry'       => $useBillingAsShipping ? $country : $shipCountry,
		'agreeTerms'            => (bool)($data['agree_terms']     ?? false),
		'marketingOptIn'        => (bool)($data['marketing_opt_in'] ?? false),
		'createdAt'             => date('c'),
	], JSON_UNESCAPED_UNICODE);

	$webhookKey = $webhookKeys[BC_ENV] ?? $webhookKeys['dev'];
	$hmac = base64_encode(hash_hmac('sha256', $payload, $webhookKey, true));
	$url  = $webhookUrls[BC_ENV] ?? $webhookUrls['dev'];

	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_POST           => true,
		CURLOPT_POSTFIELDS     => $payload,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT        => 30,
		CURLOPT_HTTPHEADER     => [
			'Content-Type: application/json',
			'X-Shopify-Shop-Domain: ' . $shopDomain,
			'X-Shopify-Hmac-Sha256: ' . $hmac,
			'x-functions-key: ' . $webhookKey,
		],
	]);
	$raw      = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$curlErr  = curl_error($ch);
	curl_close($ch);

	if ($curlErr)
		return ['ok' => false, 'error' => "cURL error: $curlErr", 'debug' => ['webhook_url' => $url]];

	return [
		'ok'    => $httpCode === 200,
		'debug' => [
			'http_code'       => $httpCode,
			'response_raw'    => $raw,
			'response_parsed' => json_decode($raw, true),
			'payload_sent'    => json_decode($payload, true),
			'webhook_url'     => $url,
		],
	];
}

// - 6. Dispatch action -
try {
	// Lazy helpers - only fetch ERP number / BC token for actions that need them.
	$erpNo   = null;
	$bcToken = null;
	$getErpNo = function() use ($customerId, &$erpNo) {
		if ($erpNo !== null) return $erpNo;
		// No file cache — always fetches fresh from Shopify so company changes reflect immediately.
		return $erpNo = getErpNo($customerId);
	};
	$getBcToken = function() use (&$bcToken) {
		if ($bcToken !== null) return $bcToken;
		return $bcToken = getBcToken();
	};
	$gwToken = null;
	$getGwToken = function() use (&$gwToken) {
		if ($gwToken !== null) return $gwToken;
		return $gwToken = getGwToken();
	};

	switch ($action)
	{
		/*case 'debug-customer':
			// Temporary diagnostic: returns raw companyContactProfiles for the authenticated customer.
			// Remove before go-live.
			$gid = 'gid://shopify/Customer/' . $customerId;
			$raw = curlJson('POST',
				'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
				['Content-Type: application/json', 'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN],
				json_encode(['query' => '{
					customer(id: ' . json_encode($gid) . ') {
						id email
						companyContactProfiles {
							id
							isMainContact
							company {
								id name externalId
							}
						}
					}
				}'])
			);
			echo json_encode(['ok' => true, 'customer_id' => $customerId, 'data' => $raw]);
			break;*/

		case 'ping':
			// Warm-up: acquire tokens AND hit both Azure wrapper services so they wake up.
			// getBcToken() only hits Microsoft OAuth — the BC wrapper itself stays cold until
			// we send it an actual request.
			getSsToken();
			$bcTok = getBcToken();
			// Hit the BC wrapper with a minimal request ($top=1 on a cheap endpoint).
			// Short timeout — we don't care about the result, just waking the process.
			try {
				curlJson('GET',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customers?$top=1&$select=systemId',
					['Authorization: Bearer ' . $bcTok, 'Accept: application/json']
				);
			} catch (\Throwable $e) { /* non-fatal */ }
			echo json_encode(['ok' => true]);
			break;

		case 'rate-error-notify':
			// Notification only
			echo json_encode(['ok' => true]);
			break;

		case 'save-shipping-total':
			// Key = md5(customer_id + '_' + sorted "variantId:qty" pairs).
			// The same key is independently derivable by shipping.php from rate.items
			// in the carrier service payload — no extra API call, no pointer, no TTL.
			$cents      = (int)($body['shipping_total'] ?? 0);
			$variantKey = preg_replace('/[^0-9:,]/', '', $body['variant_key'] ?? '');
			if (!$variantKey) {
				echo json_encode(['ok' => false, 'error' => 'missing variant_key']);
				exit;
			}
			$orderKey = md5($customerId . '_' . $variantKey);
			$dataFile = sys_get_temp_dir() . '/valor_shipping_order_' . $orderKey . '.json';
			file_put_contents($dataFile, json_encode(['total_cents' => $cents, 'order_key' => $orderKey]));
			$log = sys_get_temp_dir() . '/valor_shipping_debug.log';
			file_put_contents($log, date('Y-m-d H:i:s') . " action=save-shipping-total"
				. " customer=$customerId variantKey=$variantKey orderKey=$orderKey cents=$cents\n", FILE_APPEND);
			echo json_encode(['ok' => true]);
			exit;

		case 'customer-info':
			$token    = $getBcToken();
			$erpNo    = $getErpNo();
			$hdrs     = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			$customer = bcGet($token, "/api/companies/" . BC_COMPANY_ID . "/customers/byNumber/" . urlencode($erpNo), [
				'$select' => implode(',', [
					'no', 'name',
					'address', 'address2', 'city', 'county', 'postCode', 'countryRegionCode', 'phoneNo', 'email', 'creditLimitLCY', 'balanceLCY', 'shopifyMarketHandle',
					'parentCustomerNo',
				]),
			]);

			// Check for child companies via ship-to-addresses (cached, with live fallback)
			$addrRows      = getOrgShipToAddresses($erpNo, $hdrs);
			$childNos      = [];
			$defaultShipTo = null;
			$addressCount  = 0;
			foreach ($addrRows as $r) {
				if (!is_array($r)) continue;
				$addressCount++;
				$cno = $r['CustomerNo'] ?? $r['customerNo'] ?? '';
				if ($defaultShipTo === null) {
					$defaultShipTo = [
						'systemId'          => $r['systemId']          ?? $r['SystemId']          ?? '',
						'code'              => $r['code']              ?? $r['Code']              ?? '',
						'customerNo'        => $r['customerNo']        ?? $r['CustomerNo']        ?? '',
						'company'           => $r['name']              ?? $r['Name']              ?? '',
						'contact'           => $r['contact']           ?? $r['Contact']           ?? '',
						'address'           => $r['address']           ?? $r['Address']           ?? '',
						'address2'          => $r['address2']          ?? $r['Address2']          ?? '',
						'city'              => $r['city']              ?? $r['City']              ?? '',
						'state'             => $r['county']            ?? $r['County']            ?? '',
						'postCode'          => $r['postCode']          ?? $r['PostCode']          ?? '',
						'countryRegionCode' => $r['countryRegionCode'] ?? $r['CountryRegionCode'] ?? '',
						'phoneNo'           => $r['phoneNo']           ?? $r['PhoneNo']           ?? '',
						'addr'              => implode(', ', array_filter([
							$r['address']           ?? $r['Address']           ?? '',
							$r['address2']          ?? $r['Address2']          ?? '',
							$r['city']              ?? $r['City']              ?? '',
							$r['county']            ?? $r['County']            ?? '',
							$r['postCode']          ?? $r['PostCode']          ?? '',
							$r['countryRegionCode'] ?? $r['CountryRegionCode'] ?? '',
						])),
					];
				}
				if ($cno && $cno !== $erpNo) $childNos[$cno] = true;
			}
			$customer['childCount']    = count($childNos);
			$customer['addressCount']  = $addressCount;
			$customer['defaultShipTo'] = $defaultShipTo;

			echo json_encode(['ok' => true, 'data' => $customer]);
			break;

		case 'default-ship-to':
			$token   = $getBcToken();
			$erpNo   = $getErpNo();
			$staRows = getOrgShipToAddresses($erpNo, ['Authorization: Bearer ' . $token, 'Accept: application/json']);
			$r = $staRows[0] ?? null;
			if (!$r) { echo json_encode(['ok' => true, 'data' => null]); break; }
			echo json_encode(['ok' => true, 'data' => [
				'systemId'          => $r['systemId']          ?? $r['SystemId']          ?? '',
				'code'              => $r['code']              ?? $r['Code']              ?? '',
				'customerNo'        => $r['customerNo']        ?? $r['CustomerNo']        ?? '',
				'company'           => $r['name']              ?? $r['Name']              ?? '',
				'contact'           => $r['contact']           ?? $r['Contact']           ?? '',
				'address'           => $r['address']           ?? $r['Address']           ?? '',
				'address2'          => $r['address2']          ?? $r['Address2']          ?? '',
				'city'              => $r['city']              ?? $r['City']              ?? '',
				'state'             => $r['county']            ?? $r['County']            ?? '',
				'postCode'          => $r['postCode']          ?? $r['PostCode']          ?? '',
				'countryRegionCode' => $r['countryRegionCode'] ?? $r['CountryRegionCode'] ?? '',
				'phoneNo'           => $r['phoneNo']           ?? $r['PhoneNo']           ?? '',
				'addr'              => implode(', ', array_filter([
					$r['address']           ?? $r['Address']           ?? '',
					$r['address2']          ?? $r['Address2']          ?? '',
					$r['city']              ?? $r['City']              ?? '',
					$r['county']            ?? $r['County']            ?? '',
					$r['postCode']          ?? $r['PostCode']          ?? '',
					$r['countryRegionCode'] ?? $r['CountryRegionCode'] ?? '',
				])),
			]]);
			break;

		case 'ship-to-addresses':
			// Fetch all company locations from Shopify Admin API using cursor-based pagination.
			// Returns same field names as the ERP case so the frontend needs no changes.
			$gid        = 'gid://shopify/Customer/' . $customerId;
			$locations  = [];
			$cursor     = null;
			$contactGid = '';
			$companyGid = '';

			// First request: query through customer to resolve the company GID.
			$initQuery = json_encode(['query' => '{
				customer(id: ' . json_encode($gid) . ') {
					companyContactProfiles {
						id
						company {
							id
							locations(first: 250) {
								pageInfo { hasNextPage endCursor }
								nodes {
									id name
									bcSystemId:   metafield(namespace: "custom", key: "bc_systemid")       { value }
									bcCustomerNo: metafield(namespace: "custom", key: "bc_customer_number") { value }
									bcShipToCode: metafield(namespace: "custom", key: "bc_ship_to_code")    { value }
									salesForceId: metafield(namespace: "custom", key: "sales_force_id")     { value }
									shippingAddress {
										address1 address2 city
										zoneCode zip countryCode phone
									}
								}
							}
						}
					}
				}
			}']);

			$initData = curlJson(
				'POST',
				'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
				['Content-Type: application/json', 'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN],
				$initQuery
			);
			if (!empty($initData['errors']))
				throw new RuntimeException('GraphQL error: ' . $initData['errors'][0]['message']);

			$profile    = $initData['data']['customer']['companyContactProfiles'][0] ?? [];
			$contactGid = $profile['id']          ?? '';
			$companyGid = $profile['company']['id'] ?? '';
			if (!$companyGid)
				throw new RuntimeException('No B2B company found for this customer.');

			$locData   = $profile['company']['locations'] ?? [];
			$locations = $locData['nodes'] ?? [];
			$pageInfo  = $locData['pageInfo'] ?? [];
			$cursor    = $pageInfo['hasNextPage'] ? ($pageInfo['endCursor'] ?? null) : null;

			// Subsequent pages: query company directly by GID to avoid non-deterministic companyContactProfiles ordering.
			while ($cursor !== null) {
				$pageQuery = json_encode(['query' => '{
					company(id: ' . json_encode($companyGid) . ') {
						locations(first: 250, after: ' . json_encode($cursor) . ') {
							pageInfo { hasNextPage endCursor }
							nodes {
								id name
								bcSystemId:   metafield(namespace: "custom", key: "bc_systemid")       { value }
								bcCustomerNo: metafield(namespace: "custom", key: "bc_customer_number") { value }
								bcShipToCode: metafield(namespace: "custom", key: "bc_ship_to_code")    { value }
								salesForceId: metafield(namespace: "custom", key: "sales_force_id")     { value }
								shippingAddress {
									address1 address2 city
									zoneCode zip countryCode phone
								}
							}
						}
					}
				}']);

				$pageData = curlJson(
					'POST',
					'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
					['Content-Type: application/json', 'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN],
					$pageQuery
				);
				if (!empty($pageData['errors']))
					throw new RuntimeException('GraphQL error: ' . $pageData['errors'][0]['message']);

				$locData   = $pageData['data']['company']['locations'] ?? [];
				$locations = array_merge($locations, $locData['nodes'] ?? []);
				$pageInfo  = $locData['pageInfo'] ?? [];
				$cursor    = $pageInfo['hasNextPage'] ? ($pageInfo['endCursor'] ?? null) : null;
			}

			// Deduplicate by location GID (safety net).
			$unique = [];
			foreach ($locations as $loc) {
				$lid = $loc['id'] ?? '';
				if ($lid && !isset($unique[$lid])) $unique[$lid] = $loc;
			}
			$locations = array_values($unique);

			$addresses = array_map(function($loc) use ($companyGid, $contactGid) {
				$addr     = $loc['shippingAddress'] ?? [];
				$gidParts = explode('/', $loc['id'] ?? '');
				return [
					'code'              => $loc['bcSystemId']['value'] ?? end($gidParts),
					'bcSystemId'        => $loc['bcSystemId']['value']    ?? '',
					'bcCustomerNo'      => $loc['bcCustomerNo']['value']  ?? '',
					'bcShipToCode'      => $loc['bcShipToCode']['value']  ?? '',
					'salesForceId'      => $loc['salesForceId']['value']  ?? '',
					'locationGid'       => $loc['id']            ?? '',
					'companyGid'        => $companyGid,
					'companyContactGid' => $contactGid,
					'name'              => $loc['name']          ?? '',
					'address'           => $addr['address1']     ?? '',
					'address2'          => $addr['address2']     ?? '',
					'city'              => $addr['city']         ?? '',
					'county'            => $addr['zoneCode']     ?? '',
					'postCode'          => $addr['zip']          ?? '',
					'countryRegionCode' => $addr['countryCode']  ?? '',
					'phoneNo'           => $addr['phone']        ?? '',
				];
			}, $locations);

			// Deduplicate by code (bcSystemId) — ERP-Shopify sync can produce multiple
			// Shopify locations sharing the same BC system ID.
			$byCode = [];
			foreach ($addresses as $a) {
				$k = ($a['code'] !== '') ? $a['code'] : ($a['locationGid'] ?? '');
				if ($k && !isset($byCode[$k])) $byCode[$k] = $a;
			}
			$addresses = array_values($byCode);

			echo json_encode(['ok' => true, 'data' => $addresses]);
			break;

		case 'checkout-options':
			$subtotal = (float)($body['subtotal'] ?? 0);
			$weight   = (float)($body['weight']   ?? 0);
			$shipTo   = (array)($body['ship_to']  ?? []);
			$ssToken  = getSsToken();
			$reqBody  = json_encode([
				'customerNo'  => $getErpNo() ?: null,
				'subtotalLCY' => $subtotal,
				'totalWeight' => $weight,
				'capacityLbs' => 150.0,
				'shipTo'      => array_filter([
					'name'          => $shipTo['name']     ?? null,
					'addressLine1'  => $shipTo['address1'] ?? null,
					'addressLine2'  => $shipTo['address2'] ?? null,
					'cityLocality'  => $shipTo['city']     ?? null,
					'stateProvince' => $shipTo['state']    ?? null,
					'postalCode'    => $shipTo['zip']      ?? null,
					'countryCode'   => ($shipTo['country'] ?? '') ?: 'US',
					'phone'         => ($shipTo['phone'] ?? '') ?: '0000000000',
				], fn($v) => $v !== null && $v !== ''),
			]);
			try {
				$result = curlJson('POST', SS_BASE_URL . '/api/freight/checkout-options',
					[
						'Content-Type: application/json',
						'Accept: application/json',
						'Authorization: Bearer ' . $ssToken,
					],
					$reqBody
				);
				echo json_encode(['ok' => true, 'data' => $result]);
			} catch (RuntimeException $e) {
				echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
			}
			break;

		case 'create-draft-order':
			$payload = $body['draft_order'] ?? null;
			if (!$payload) jsonErr('Missing draft_order payload');

			// Verify the draft order is for the authenticated customer only
			$draftCustomerId = (string)($payload['customer']['id'] ?? '');
			if ($draftCustomerId !== $customerId)
				jsonErr('Customer ID mismatch', 403);

			// Build GraphQL DraftOrderInput
			$currencyCode = $payload['currency_code'] ?? 'USD';
			$lineItems = array_map(function($item) use ($currencyCode) {
				$li = [
					'variantId' => 'gid://shopify/ProductVariant/' . (int)$item['variant_id'],
					'quantity'  => (int)$item['quantity'],
				];
				if (isset($item['price_override'])) $li['priceOverride'] = ['amount' => number_format((float)$item['price_override'], 2, '.', ''), 'currencyCode' => $currencyCode];
				return $li;
			}, $payload['line_items'] ?? []);

			$input = ['lineItems' => $lineItems];

			// B2B purchasing entity (pre-fills the Ship to company location selector)
			$pe = $payload['purchasing_entity'] ?? null;
			if ($pe) {
				$input['purchasingEntity'] = ['purchasingCompany' => [
					'companyId'         => $pe['purchasingCompany']['companyId']         ?? null,
					'companyLocationId' => $pe['purchasingCompany']['companyLocationId'] ?? null,
					'companyContactId'  => $pe['purchasingCompany']['companyContactId']  ?? null,
				]];
			}

			// Shipping address (REST snake_case -> GraphQL camelCase)
			$sa = $payload['shipping_address'] ?? null;
			if ($sa) {
				$input['shippingAddress'] = array_filter([
					'firstName'   => $sa['first_name']   ?? null,
					'address1'    => $sa['address1']     ?? null,
					'address2'    => ($sa['address2'] ?? '') ?: null,
					'city'        => $sa['city']         ?? null,
					'province'    => $sa['province']     ?? null,
					'zip'         => $sa['zip']          ?? null,
					'countryCode' => $sa['country_code'] ?? null,
					'phone'       => ($sa['phone'] ?? '') ?: null,
				], fn($v) => $v !== null);
			}

			// Shipping line
			$sl = $payload['shipping_line'] ?? null;
			if ($sl) $input['shippingLine'] = ['title' => $sl['title'], 'price' => (string)$sl['price']];

			// Note attributes
			$na = $payload['note_attributes'] ?? [];
			if ($na) $input['customAttributes'] = array_map(fn($a) => ['key' => $a['name'], 'value' => $a['value']], $na);

			// Metafields
			$mf = $payload['metafields'] ?? [];
			if ($mf) $input['metafields'] = array_map(fn($m) => [
				'namespace' => $m['namespace'],
				'key'       => $m['key'],
				'value'     => $m['value'],
				'type'      => $m['type'],
			], $mf);

			$mutation = 'mutation draftOrderCreate($input: DraftOrderInput!) {
				draftOrderCreate(input: $input) {
					draftOrder { id invoiceUrl }
					userErrors { field message }
				}
			}';

			$result = curlJson(
				'POST',
				'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
				[
					'Content-Type: application/json',
					'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN,
				],
				json_encode(['query' => $mutation, 'variables' => ['input' => $input]])
			);

			if (!empty($result['errors']))
				jsonErr('GraphQL error: ' . $result['errors'][0]['message'], 500);

			$userErrors = $result['data']['draftOrderCreate']['userErrors'] ?? [];
			if (!empty($userErrors))
				jsonErr('Draft order error: ' . $userErrors[0]['message'], 500);

			$invoiceUrl = $result['data']['draftOrderCreate']['draftOrder']['invoiceUrl'] ?? null;
			if (!$invoiceUrl)
				jsonErr('Draft order created but no invoiceUrl returned', 500);

			echo json_encode(['ok' => true, 'invoice_url' => $invoiceUrl]);
			break;

		case 'order-detail':
			$orderId = trim((string)($body['order_id'] ?? ''));
			if (!$orderId) jsonErr('Missing order_id');
			$source  = trim((string)($body['source'] ?? ''));

			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$headers = ['Authorization: Bearer ' . $token, 'Accept: application/json'];

			// Shared helper: enrich BC line items with Shopify product title, image, handle
			$enrichLines = function (array $rawLines) {
				$itemLines = array_values(array_filter($rawLines, function ($li) {
					return ($li['type'] ?? '') === 'Item' || isset($li['no']);
				}));
				$productMap = [];
				$upcs = array_unique(array_filter(array_map(fn($li) => $li['no'] ?? '', $itemLines)));
				if ($upcs) {
					$barcodeQuery = implode(' OR ', array_map(fn($b) => 'barcode:' . $b, $upcs));
					$gql = 'query($q:String!){productVariants(first:250,query:$q){nodes{barcode sku product{title handle featuredImage{url}}}}}';
					try {
						$shopifyResp = curlJson('POST',
							'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
							['Content-Type: application/json', 'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN, 'Accept: application/json'],
							json_encode(['query' => $gql, 'variables' => ['q' => $barcodeQuery]])
						);
						foreach ($shopifyResp['data']['productVariants']['nodes'] ?? [] as $v) {
							$bc = $v['barcode'] ?? '';
							if ($bc !== '') $productMap[$bc] = [
								'title'    => $v['product']['title']              ?? '',
								'handle'   => $v['product']['handle']             ?? '',
								'imageUrl' => $v['product']['featuredImage']['url'] ?? null,
								'sku'      => $v['sku']                           ?? '',
							];
						}
					} catch (RuntimeException $e) { /* Non-fatal */ }
				}
				return array_values(array_map(function ($li) use ($productMap) {
					$upc  = $li['no'] ?? '';
					$desc = $li['description'] ?? '';
					$prod = $productMap[$upc] ?? null;
					$metaParts = [];
					if ($upc) $metaParts[] = 'UPC: ' . $upc;
					if ($prod && $prod['sku']) {
						$metaParts[] = 'SKU: ' . $prod['sku'];
					} elseif (!$prod) {
						// Try to extract SKU from "Category : Subcategory : SKU" description format
						$descParts    = array_map('trim', explode(':', $desc));
						$extractedSku = count($descParts) > 1 ? end($descParts) : '';
						if ($extractedSku) $metaParts[] = 'SKU: ' . $extractedSku;
					}
					return [
						'title'                => $prod ? $prod['title'] : ($desc ?: $upc),
						'variantTitle'         => '',
						'meta'                 => implode(' · ', $metaParts),
						'quantity'             => (int)($li['quantity']  ?? 1),
						'image'                => ($prod && $prod['imageUrl']) ? ['url' => $prod['imageUrl']] : null,
						'variant'              => $prod ? ['product' => ['handle' => $prod['handle']]] : null,
						'originalUnitPriceSet' => ['shopMoney' => ['amount' => (string)($li['unitPrice'] ?? 0), 'currencyCode' => 'USD']],
					];
				}, $itemLines));
			};

			$isInvoice = ($source === 'invoice') || (!$source && str_starts_with($orderId, 'INV-'));
			if ($isInvoice) {
				// ── Invoice detail branch ─────────────────────────────────────────
				$invNo = str_starts_with($orderId, 'INV-') ? substr($orderId, 4) : $orderId;

				// Fetch invoice header — try modern table first, fall back to history.
				// Use a short probe timeout: a 404/empty means legacy; a real timeout means BC is down.
				$bcInv    = null;
				$rawLines = [];
				$isLegacyInv = false;
				try {
					$bcInv = curlJson('GET',
						BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices/byNumber/' . rawurlencode($invNo),
						['Authorization: Bearer ' . $token, 'Accept: application/json'],
						null, 10
					);
					if (empty($bcInv['no'])) $isLegacyInv = true;
				} catch (RuntimeException $e) {
					if ($e->getMessage() === '__TIMEOUT__')
						throw new RuntimeException('Service temporarily unavailable. Please try again.');
					$isLegacyInv = true;
				}

				if ($isLegacyInv) {
					// Legacy invoice: header + lines come from sales-invoice-history
					$hist = bcGet($token,
						'/api/companies/' . BC_COMPANY_ID . '/sales-invoice-history',
						[
							'$filter' => "no eq '" . str_replace("'", "''", $invNo) . "'",
							'$expand' => 'postedSalesInvoiceLineHistories',
							'$top'    => '1',
						]
					);
					$bcInv = $hist['value'][0] ?? null;
					if (empty($bcInv['no'])) jsonErr('Invoice not found', 404);
					$rawLines = array_filter($bcInv['postedSalesInvoiceLineHistories'] ?? [], 'is_array');
				} else {
					// Modern invoice: fetch lines from dedicated endpoint
					try {
						$linesResp = curlJson('GET',
							BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
								. '/posted-sales-invoices/lines/byDocumentNo/' . rawurlencode($invNo)
								. '?pageSize=200',
							$headers
						);
						$rawLines = array_filter($linesResp['value'] ?? [], 'is_array');
					} catch (RuntimeException $e) { /* leave empty */ }
				}

				$invSellTo = $bcInv['sellToCustomerNo'] ?? '';
				$invBillTo = $bcInv['billToCustomerNo'] ?? '';
				verifyInvoiceAccess($invSellTo, $invBillTo, $erpNo, $headers);

				$lineNodes = $enrichLines(array_values($rawLines));

				$amount   = (string)($bcInv['amountIncludingVAT'] ?? $bcInv['amountIncludingVat'] ?? $bcInv['amount'] ?? 0);
				$subtotal = (string)($bcInv['amount'] ?? $amount);
				$freight  = (float)($bcInv['freightAmount'] ?? $bcInv['freightChargeLCY'] ?? 0);
				$attrs    = [];
				if (!empty($bcInv['customerPoNo'])) $attrs[] = ['key' => 'PO #', 'value' => $bcInv['customerPoNo']];

				$order = [
					'id'                       => $orderId,
					'name'                     => $bcInv['no'],
					'orderNo'                  => $bcInv['orderNo'] ?? '',
					'externalDocumentNo'       => $bcInv['externalDocumentNo'] ?? '',
					'createdAt'                => $bcInv['postingDate'] ?? $bcInv['systemCreatedAt'] ?? '',
					'cancelledAt'              => null,
					'displayFulfillmentStatus' => 'FULFILLED',
					'orderStatus'              => 'INVOICED',
					'customAttributes'         => $attrs,
					'note'                     => null,
					'paymentGatewayNames'      => [],
					'paymentMethodCode'        => '',
					'authorizationCode'        => '',
					'transactions'             => [],
					'fulfillments'             => [],
					'discountApplications'     => ['nodes' => []],
					'shippingAddress'          => [
						'name'         => $bcInv['shipToName']              ?? '',
						'address1'     => $bcInv['shipToAddress']           ?? '',
						'address2'     => $bcInv['shipToAddress2']          ?? '',
						'city'         => $bcInv['shipToCity']              ?? '',
						'provinceCode' => $bcInv['shipToCounty']            ?? '',
						'zip'          => $bcInv['shipToPostCode']          ?? '',
						'countryCode'  => $bcInv['shipToCountryRegionCode'] ?? '',
					],
					'billingAddress'           => [
						'name'         => $bcInv['billToName']              ?? '',
						'address1'     => $bcInv['billToAddress']           ?? '',
						'address2'     => $bcInv['billToAddress2']          ?? '',
						'city'         => $bcInv['billToCity']              ?? '',
						'provinceCode' => $bcInv['billToCounty']            ?? '',
						'zip'          => $bcInv['billToPostCode']          ?? '',
						'countryCode'  => $bcInv['billToCountryRegionCode'] ?? '',
					],
					'subtotalPriceSet'      => ['shopMoney' => ['amount' => $subtotal, 'currencyCode' => 'USD']],
					'totalPriceSet'         => ['shopMoney' => ['amount' => $amount,   'currencyCode' => 'USD']],
					'totalShippingPriceSet' => $freight > 0 ? ['shopMoney' => ['amount' => (string)$freight, 'currencyCode' => 'USD']] : null,
					'totalTaxSet'           => null,
					'lineItems'             => ['nodes' => $lineNodes],
				];
			} else {
				// ── Sales order branch ────────────────────────────────────────────
				$orderNo = $orderId;

				try {
					$bcOrder = curlJson('GET',
						BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/sales-orders/byNumber/' . urlencode($orderNo),
						$headers
					);
				} catch (\Throwable $e) {
					error_log('[order-detail] sales-orders/byNumber threw (likely 404): ' . $e->getMessage());
					$bcOrder = [];
				}

				// If not found as an open sales order, fall back to invoice history by orderNo
				if (empty($bcOrder['no'])) {
					$_soFilter = "orderNo eq '" . str_replace("'", "''", $orderNo) . "'";
					error_log('[order-detail] SO not found, trying invoice fallback: orderNo=' . $orderNo);
					$bcInv    = null;
					$rawLines = [];

					// Attempt 1: posted-sales-invoices filtered by orderNo (modern invoices)
					try {
						$psiList = bcGet($token, '/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices', [
							'$filter' => $_soFilter,
							'$top'    => '1',
						]);
						error_log('[order-detail] psi totalCount=' . ($psiList['totalCount'] ?? '?') . ' value_count=' . count($psiList['value'] ?? []));
						if (!empty($psiList['value'][0]['no'])) {
							$bcInv = $psiList['value'][0];
							try {
								$psiNo     = $bcInv['no'];
								$linesResp = curlJson('GET',
									BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices/lines/byDocumentNo/' . rawurlencode($psiNo) . '?pageSize=200',
									$headers
								);
								$rawLines = array_filter($linesResp['value'] ?? [], 'is_array');
							} catch (\Throwable $e) {
								error_log('[order-detail] psi lines threw: ' . $e->getMessage());
							}
						}
					} catch (\Throwable $e) {
						error_log('[order-detail] psi threw: ' . $e->getMessage());
					}

					// Attempt 2: sales-invoice-history filtered by orderNo (legacy invoices)
					if (empty($bcInv['no'])) {
						try {
							$hist = bcGet($token, '/api/companies/' . BC_COMPANY_ID . '/sales-invoice-history', [
								'$filter' => $_soFilter,
								'$expand' => 'postedSalesInvoiceLineHistories',
								'$top'    => '1',
							]);
							error_log('[order-detail] hist totalCount=' . ($hist['totalCount'] ?? '?') . ' value_count=' . count($hist['value'] ?? []));
							if (!empty($hist['value'][0]['no'])) {
								$bcInv    = $hist['value'][0];
								$rawLines = array_filter($bcInv['postedSalesInvoiceLineHistories'] ?? [], 'is_array');
							}
						} catch (\Throwable $e) {
							error_log('[order-detail] hist threw: ' . $e->getMessage());
						}
					}

					if (empty($bcInv['no'])) jsonErr('Order not found', 404);

					$invSellTo = $bcInv['sellToCustomerNo'] ?? '';
					$invBillTo = $bcInv['billToCustomerNo'] ?? '';
					verifyInvoiceAccess($invSellTo, $invBillTo, $erpNo, $headers);

					// $rawLines already populated during lookup above; don't overwrite
					if (empty($rawLines) && !empty($bcInv['postedSalesInvoiceLineHistories'])) {
						$rawLines = array_filter($bcInv['postedSalesInvoiceLineHistories'], 'is_array');
					}
					$lineNodes = $enrichLines(array_values($rawLines));
					$amount    = (string)($bcInv['amountIncludingVAT'] ?? $bcInv['totalAmount'] ?? $bcInv['amount'] ?? 0);
					$subtotal  = (string)($bcInv['amount'] ?? $bcInv['subTotal'] ?? $amount);
					$freight   = (float)($bcInv['freightChargeLCY'] ?? 0);
					$attrs     = [];
					if (!empty($bcInv['externalDocumentNo'])) $attrs[] = ['key' => 'PO #', 'value' => $bcInv['externalDocumentNo']];

					$order = [
						'id'                       => $bcInv['no'],
						'name'                     => $bcInv['no'],
						'orderNo'                  => $bcInv['orderNo'] ?? '',
						'externalDocumentNo'       => $bcInv['externalDocumentNo'] ?? '',
						'createdAt'                => $bcInv['postingDate'] ?? '',
						'cancelledAt'              => null,
						'displayFulfillmentStatus' => 'FULFILLED',
						'orderStatus'              => 'INVOICED',
						'customAttributes'         => $attrs,
						'note'                     => null,
						'paymentGatewayNames'      => [],
						'paymentMethodCode'        => '',
						'authorizationCode'        => '',
						'transactions'             => [],
						'fulfillments'             => [],
						'discountApplications'     => ['nodes' => []],
						'shippingAddress'          => [
							'name'         => $bcInv['shipToName']              ?? '',
							'address1'     => $bcInv['shipToAddress']           ?? '',
							'address2'     => $bcInv['shipToAddress2']          ?? '',
							'city'         => $bcInv['shipToCity']              ?? '',
							'provinceCode' => $bcInv['shipToCounty']            ?? '',
							'zip'          => $bcInv['shipToPostCode']          ?? '',
							'countryCode'  => $bcInv['shipToCountryRegionCode'] ?? '',
						],
						'billingAddress'           => [
							'name'         => $bcInv['billToName']              ?? '',
							'address1'     => $bcInv['billToAddress']           ?? '',
							'address2'     => $bcInv['billToAddress2']          ?? '',
							'city'         => $bcInv['billToCity']              ?? '',
							'provinceCode' => $bcInv['billToCounty']            ?? '',
							'zip'          => $bcInv['billToPostCode']          ?? '',
							'countryCode'  => $bcInv['billToCountryRegionCode'] ?? '',
						],
						'subtotalPriceSet'      => ['shopMoney' => ['amount' => $subtotal, 'currencyCode' => 'USD']],
						'totalPriceSet'         => ['shopMoney' => ['amount' => $amount,   'currencyCode' => 'USD']],
						'totalShippingPriceSet' => $freight > 0 ? ['shopMoney' => ['amount' => (string)$freight, 'currencyCode' => 'USD']] : null,
						'totalTaxSet'           => null,
						'lineItems'             => ['nodes' => $lineNodes],
					];
					echo json_encode(['ok' => true, 'data' => $order]);
					exit;
				}

				$orderCustomerNo = $bcOrder['sellToCustomerNo'] ?? '';
				verifyOrderAccess($orderCustomerNo, $erpNo, $headers);

				$bcLines = curlJson('GET',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/sales-orders/lines/byDocumentNo/' . urlencode($orderNo),
					$headers
				);
				$itemLines = array_values(array_filter($bcLines['value'] ?? [], fn($li) => ($li['type'] ?? '') === 'Item'));
				$lineNodes = $enrichLines($itemLines);

				$status      = strtolower($bcOrder['status'] ?? '');
				$cancelledAt = $status === 'cancelled' ? ($bcOrder['systemModifiedAt'] ?? date('c')) : null;
				if ($bcOrder['completelyShipped'] ?? false)   $fs = 'FULFILLED';
				elseif ($bcOrder['shipped'] ?? false)          $fs = 'PARTIAL';
				else                                           $fs = 'UNFULFILLED';
				$amount   = (string)($bcOrder['amountIncludingVAT'] ?? $bcOrder['amount'] ?? 0);
				$subtotal = (string)($bcOrder['amount'] ?? $amount);
				$freight  = (float)($bcOrder['freightChargeLCY'] ?? 0);
				$attrs    = [];
				if (!empty($bcOrder['customerPoNo'])) $attrs[] = ['key' => 'PO #', 'value' => $bcOrder['customerPoNo']];

				$order = [
					'id'                       => $bcOrder['no'],
					'name'                     => $bcOrder['no'],
					'createdAt'                => $bcOrder['systemCreatedAt'] ?? $bcOrder['orderDate'] ?? '',
					'cancelledAt'              => $cancelledAt,
					'displayFulfillmentStatus' => $fs,
					'orderStatus'              => $bcOrder['orderStatus'] ?? '',
					'customAttributes'         => $attrs,
					'note'                     => null,
					'paymentGatewayNames'      => array_filter([$bcOrder['paymentMethodCode'] ?? '']),
					'paymentMethodCode'        => $bcOrder['paymentMethodCode']  ?? '',
					'authorizationCode'        => $bcOrder['authorizationCode']  ?? '',
					'transactions'             => [],
					'fulfillments'             => [],
					'discountApplications'     => ['nodes' => []],
					'shippingAddress'          => [
						'name'         => $bcOrder['shipToName']              ?? '',
						'address1'     => $bcOrder['shipToAddress']           ?? '',
						'address2'     => $bcOrder['shipToAddress2']          ?? '',
						'city'         => $bcOrder['shipToCity']              ?? '',
						'provinceCode' => $bcOrder['shipToCounty']            ?? '',
						'zip'          => $bcOrder['shipToPostCode']          ?? '',
						'countryCode'  => $bcOrder['shipToCountryRegionCode'] ?? '',
					],
					'billingAddress'           => [
						'name'         => $bcOrder['billToName']              ?? '',
						'address1'     => $bcOrder['billToAddress']           ?? '',
						'address2'     => $bcOrder['billToAddress2']          ?? '',
						'city'         => $bcOrder['billToCity']              ?? '',
						'provinceCode' => $bcOrder['billToCounty']            ?? '',
						'zip'          => $bcOrder['billToPostCode']          ?? '',
						'countryCode'  => $bcOrder['billToCountryRegionCode'] ?? '',
					],
					'subtotalPriceSet'      => ['shopMoney' => ['amount' => $subtotal, 'currencyCode' => 'USD']],
					'totalPriceSet'         => ['shopMoney' => ['amount' => $amount,   'currencyCode' => 'USD']],
					'totalShippingPriceSet' => $freight > 0 ? ['shopMoney' => ['amount' => (string)$freight, 'currencyCode' => 'USD']] : null,
					'totalTaxSet'           => null,
					'lineItems'             => ['nodes' => $lineNodes],
				];
			}

			echo json_encode(['ok' => true, 'data' => $order]);
			break;

		case 'order-list':
			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$headers = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			$page    = max(1, (int)($body['page'] ?? 1));

			// Fetch sales orders and posted invoices in parallel
			$urls = [
				'orders'  => BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
					. '/sales-orders/by-customer/' . urlencode($erpNo)
					. '?includeChildren=true&page=' . $page . '&pageSize=40'
					. '&$select=no,status,systemCreatedAt,systemModifiedAt,orderDate,completelyShipped,shipped,amountIncludingVAT,amount,totalQuantity,customerPoNo,orderStatus,sellToCustomerNo,shipToName,shipToAddress,shipToAddress2,shipToCity,shipToCounty,shipToPostCode,shipToCountryRegionCode',
				'invoices' => BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
					. '/posted-sales-invoices/by-customer/' . rawurlencode($erpNo) . '/slim'
					. '?includeChildren=true&page=' . $page . '&pageSize=40',
			];
			$curlHeaders = array_map(fn($h) => $h, $headers); // copy

			// Run a parallel fetch for both URLs and return [$results, $httpCodes, $curlErrors].
			$parallelFetch = function (int $timeout) use ($urls, $curlHeaders): array {
				$mh  = curl_multi_init();
				$chs = [];
				foreach ($urls as $key => $url) {
					$ch = curl_init($url);
					curl_setopt_array($ch, [
						CURLOPT_RETURNTRANSFER => true,
						CURLOPT_HTTPHEADER     => $curlHeaders,
						CURLOPT_TIMEOUT        => $timeout,
					]);
					curl_multi_add_handle($mh, $ch);
					$chs[$key] = $ch;
				}
				do { curl_multi_exec($mh, $running); curl_multi_select($mh); } while ($running > 0);
				// curl_error() is unreliable with curl_multi — use curl_multi_info_read() instead.
				$curlErrCodes = [];
				while ($info = curl_multi_info_read($mh)) {
					if ($info['msg'] !== CURLMSG_DONE) continue;
					foreach ($chs as $key => $ch) {
						if ($ch === $info['handle']) $curlErrCodes[$key] = $info['result'];
					}
				}
				$results    = [];
				$httpCodes  = [];
				$curlErrors = [];
				foreach ($chs as $key => $ch) {
					$raw  = curl_multi_getcontent($ch);
					$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
					$httpCodes[$key]  = $code;
					$errCode = $curlErrCodes[$key] ?? 0;
					$curlErrors[$key] = $errCode ? curl_strerror($errCode) . ' (CURLE_' . $errCode . ')' : null;
					curl_multi_remove_handle($mh, $ch);
					curl_close($ch);
					$results[$key] = ($code < 400 && $raw) ? (json_decode($raw, true) ?? []) : [];
				}
				curl_multi_close($mh);
				return [$results, $httpCodes, $curlErrors];
			};

			// First attempt (40 s). If both connections fail at the OS level (httpCode 0 /
			// CURLE_28), Azure App Service is cold-starting. Our timed-out request already
			// triggered the warm-up, so sleeping 3 s then retrying usually succeeds quickly.
			[$results, $httpCodes, $curlErrors] = $parallelFetch(40);
			if ($httpCodes['orders'] === 0 && $httpCodes['invoices'] === 0) {
				error_log('[order-list] cold-start detected, retrying in 3s erpNo=' . $erpNo);
				sleep(3);
				[$results, $httpCodes, $curlErrors] = $parallelFetch(25);
			}

			$ordersRaw = $results['orders'];
			$invRaw    = $results['invoices'] ?: null;
			if (!is_array($ordersRaw) || !array_key_exists('value', $ordersRaw)) {
				error_log('[order-list] orders fetch failed erpNo=' . $erpNo . ' page=' . $page
					. ' httpCodes=' . json_encode($httpCodes)
					. ' curlErrors=' . json_encode(array_filter($curlErrors))
					. ' urls=' . json_encode($urls));
				jsonErr('Failed to fetch orders from ERP', 500);
			}
			error_log('[order-list] ok erpNo=' . $erpNo . ' page=' . $page
				. ' orders=' . count($ordersRaw['value'] ?? [])
				. ' invoices=' . count($invRaw['value'] ?? []));


			$orders = array_map(function ($o) {
				$status      = strtolower($o['status'] ?? '');
				$cancelledAt = $status === 'cancelled' ? ($o['systemModifiedAt'] ?? date('c')) : null;
				if ($o['completelyShipped'] ?? false)   $fs = 'FULFILLED';
				elseif ($o['shipped'] ?? false)          $fs = 'PARTIAL';
				else                                     $fs = 'UNFULFILLED';
				$amount   = (string)($o['amountIncludingVAT'] ?? $o['amount'] ?? 0);
				$subtotal = (string)($o['amount'] ?? $amount);
				$attrs    = [];
				if (!empty($o['customerPoNo'])) $attrs[] = ['key' => 'PO #', 'value' => $o['customerPoNo']];
				return [
					'id'                       => $o['no'] ?? '',
					'name'                     => $o['no'] ?? '',
					'_source'                  => 'order',
					'_sellToCustomerNo'        => $o['sellToCustomerNo'] ?? '',
					'_shipToAddress'           => trim(implode(' ', array_filter([
						$o['shipToName']     ?? '',
						$o['shipToAddress']  ?? '',
						$o['shipToAddress2'] ?? '',
						$o['shipToCity']     ?? '',
						$o['shipToCounty']   ?? '',
						$o['shipToPostCode'] ?? '',
					]))),
					'createdAt'                => $o['systemCreatedAt'] ?? $o['orderDate'] ?? '',
					'cancelledAt'              => $cancelledAt,
					'displayFulfillmentStatus' => $fs,
					'orderStatus'              => $o['orderStatus'] ?? '',
					'customAttributes'         => $attrs,
					'lineItemsCount'           => (int)($o['totalQuantity'] ?? 0),
					'totalPriceSet'            => ['shopMoney' => ['amount' => $amount,   'currencyCode' => 'USD']],
					'subtotalPriceSet'         => ['shopMoney' => ['amount' => $subtotal, 'currencyCode' => 'USD']],
				];
			}, $ordersRaw['value'] ?? []);

			$invoices = array_map(function ($inv) {
				$amount   = (string)($inv['totalAmount'] ?? $inv['subTotal'] ?? $inv['amountIncludingVAT'] ?? 0);
				$subtotal = (string)($inv['subTotal'] ?? $inv['amount'] ?? $amount);
				$attrs    = [];
				if (!empty($inv['externalDocumentNo'])) $attrs[] = ['key' => 'PO #', 'value' => $inv['externalDocumentNo']];
				return [
					'id'                       => 'INV-' . ($inv['no'] ?? ''),
					'name'                     => $inv['no'] ?? '',
					'orderNo'                  => $inv['orderNo'] ?? '',
					'_source'                  => 'invoice',
					'_sellToCustomerNo'        => $inv['sellToCustomerNo'] ?? '',
					'_shipToAddress'           => trim(implode(' ', array_filter([
						$inv['shipToName']     ?? '',
						$inv['shipToAddress']  ?? '',
						$inv['shipToAddress2'] ?? '',
						$inv['shipToCity']     ?? '',
						$inv['shipToCounty']   ?? '',
						$inv['shipToPostCode'] ?? '',
					]))),
					'createdAt'                => $inv['postingDate'] ?? $inv['systemCreatedAt'] ?? '',
					'cancelledAt'              => null,
					'displayFulfillmentStatus' => 'FULFILLED',
					'orderStatus'              => 'INVOICED',
					'customAttributes'         => $attrs,
					'lineItemsCount'           => (int)($inv['totalQuantity'] ?? 0),
					'totalPriceSet'            => ['shopMoney' => ['amount' => $amount,   'currencyCode' => 'USD']],
					'subtotalPriceSet'         => ['shopMoney' => ['amount' => $subtotal, 'currencyCode' => 'USD']],
				];
			}, array_filter($invRaw['value'] ?? [], 'is_array'));

			// Merge and sort by date descending
			$combined = array_merge($orders, $invoices);
			usort($combined, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));

			echo json_encode([
				'ok'         => true,
				'orders'     => array_values($combined),
				'hasMore'    => (bool)($ordersRaw['hasMore'] ?? false) || (bool)($invRaw['hasMore'] ?? false),
				'page'       => $page,
				'totalCount' => (int)($ordersRaw['totalCount'] ?? 0) + (int)($invRaw['totalCount'] ?? 0),
				'totalPages' => max((int)($ordersRaw['totalPages'] ?? 1), (int)($invRaw['totalPages'] ?? 1)),
			]);
			break;

		case 'dash-recent':
			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$headers = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			$startDate = date('Y-m-d', strtotime('-30 days'));
			$endDate   = date('Y-m-d');
			$url = BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
				. '/posted-sales-invoices/by-customer/' . rawurlencode($erpNo) . '/slim'
				. '?includeChildren=true'
				. '&startDate=' . $startDate
				. '&endDate=' . $endDate
				. '&page=1&pageSize=6';
			error_log('[dash-recent] erpNo=' . $erpNo . ' url=' . $url);
			$result = curlJson('GET', $url, $headers);
			$rows = array_map(function ($r) {
				$amount = (string)($r['totalAmount'] ?? $r['subTotal'] ?? 0);
				$attrs  = [];
				if (!empty($r['externalDocumentNo'])) $attrs[] = ['key' => 'PO #', 'value' => $r['externalDocumentNo']];
				return [
					'id'                       => 'INV-' . ($r['no'] ?? ''),
					'name'                     => $r['no'] ?? '',
					'orderNo'                  => $r['orderNo'] ?? '',
					'_source'                  => 'invoice',
					'_sellToCustomerNo'        => $r['sellToCustomerNo'] ?? '',
					'_shipToAddress'           => trim(implode(' ', array_filter([
						$r['shipToName']    ?? '',
						$r['shipToAddress'] ?? '',
						$r['shipToCity']    ?? '',
						$r['shipToCounty']  ?? '',
						$r['shipToPostCode'] ?? '',
					]))),
					'createdAt'                => $r['postingDate'] ?? '',
					'cancelledAt'              => null,
					'displayFulfillmentStatus' => 'FULFILLED',
					'orderStatus'              => 'INVOICED',
					'customAttributes'         => $attrs,
					'lineItemsCount'           => (int)($r['totalQuantity'] ?? 0),
					'totalPriceSet'            => ['shopMoney' => ['amount' => $amount, 'currencyCode' => 'USD']],
					'subtotalPriceSet'         => ['shopMoney' => ['amount' => (string)($r['subTotal'] ?? $amount), 'currencyCode' => 'USD']],
				];
			}, $result['value'] ?? []);
			echo json_encode([
				'ok'         => true,
				'orders'     => array_values($rows),
				'totalCount' => (int)($result['totalCount'] ?? count($rows)),
			]);
			break;

		case 'invoice-list':
			$_t0 = microtime(true);
			error_log('[invoice-list] step=start');
			$erpNo   = $getErpNo();
			error_log('[invoice-list] step=erpNo t=' . round(microtime(true) - $_t0, 2) . 's erpNo=' . $erpNo);
			$token   = $getBcToken();
			error_log('[invoice-list] step=bcToken t=' . round((microtime(true) - $_t0), 2) . 's');
			$headers = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			$page    = max(1, (int)($body['page'] ?? 1));
			$url = BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
				. '/posted-sales-invoices/by-customer/' . rawurlencode($erpNo) . '/slim'
				. '?includeChildren=true'
				. '&page=' . $page . '&pageSize=40';
			error_log('[invoice-list] step=bcCall t=' . round((microtime(true) - $_t0), 2) . 's curl: ' . $url);
			if (true)
			{
				$result = curlJson('GET', $url, $headers);
				error_log('[invoice-list] step=done t=' . round(microtime(true) - $_t0, 2) . 's invoices=' . count($result['value'] ?? []));
			}
			else
			{
				// Inline fetch with cold-start retry. Total ceiling (25s + 2s + 20s = 47s) stays
				// below nginx fastcgi_read_timeout so we never produce a gateway 500.
				$invFetch = function (int $timeout) use ($url, $headers): array {
					$ch = curl_init($url);
					curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers, CURLOPT_TIMEOUT => $timeout]);
					$raw      = curl_exec($ch);
					$errno    = curl_errno($ch);
					$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
					curl_close($ch);
					return [$raw, $errno, $httpCode];
				};
				[$raw, $errno, $httpCode] = $invFetch(25);
				if ($httpCode === 0 && $errno !== 0) {
					// Azure App Service cold-start: connection timed out before any HTTP response.
					// The first request already triggered the warm-up; retrying now usually succeeds.
					error_log('[invoice-list] cold-start detected, retrying in 2s erpNo=' . $erpNo);
					sleep(2);
					[$raw, $errno, $httpCode] = $invFetch(20);
				}
				if ($errno)        jsonErr('Connection error. Please try again.', 503);
				if ($httpCode >= 500) jsonErr('Service temporarily unavailable. Please try again.', 503);
				$result = json_decode($raw, true) ?? [];
			}
			$invoices = array_map(function ($r) {
				// Slim endpoint uses totalAmount/subTotal; remap to legacy field names for JS compatibility.
				$r['amountIncludingVAT'] = $r['totalAmount'] ?? $r['amountIncludingVAT'] ?? null;
				$r['amount']             = $r['subTotal']    ?? $r['amount']             ?? null;
				return $r;
			}, array_filter($result['value'] ?? [], 'is_array'));
			$resp = [
				'ok'         => true,
				'invoices'   => array_values($invoices),
				'page'       => $page,
				'hasMore'    => (bool)($result['hasMore'] ?? false),
				'totalCount' => $result['totalCount'] ?? null,
				'totalPages' => $result['totalPages'] ?? null,
			];
			echo json_encode($resp);
			break;

		case 'invoice-lines':
			$invNo   = trim((string)($body['invoice_no'] ?? ''));
			if (!$invNo) jsonErr('Missing invoice_no');
			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$headers  = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			$isLegacy = false;

			// Ownership check via byNumber. 404/empty = legacy/history invoice, not an error.
			// Short probe timeout: don't wait 30s only to fall through to another 30s call.
			try {
				$invCheck = curlJson('GET',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices/byNumber/' . rawurlencode($invNo)
						. '?' . http_build_query(['$select' => 'no,sellToCustomerNo,billToCustomerNo']),
					$headers,
					null, 10
				);
				if (!empty($invCheck['no'])) {
					verifyInvoiceAccess($invCheck['sellToCustomerNo'] ?? '', $invCheck['billToCustomerNo'] ?? '', $erpNo, $headers);
				} else {
					$isLegacy = true;
				}
			} catch (RuntimeException $e) {
				if ($e->getMessage() === '__TIMEOUT__')
					throw new RuntimeException('Service temporarily unavailable. Please try again.');
				$isLegacy = true; // not in PostedSalesInvoices — try history endpoint
			}

			if ($isLegacy) {
				// Legacy invoice: fetch inline from sales-invoice-history with line expansion
				try {
					$histResult = bcGet($token,
						'/api/companies/' . BC_COMPANY_ID . '/sales-invoice-history',
						[
							'$filter' => "no eq '" . str_replace("'", "''", $invNo) . "'",
							'$expand' => 'postedSalesInvoiceLineHistories',
							'$top'    => '1',
						]
					);
					$histInv = $histResult['value'][0] ?? null;
					if ($histInv) {
						verifyInvoiceAccess($histInv['sellToCustomerNo'] ?? '', $histInv['billToCustomerNo'] ?? '', $erpNo, $headers);
					}
					$lines = array_values(array_filter($histInv['postedSalesInvoiceLineHistories'] ?? [], 'is_array'));
				} catch (RuntimeException $e) {
					$lines = [];
				}
			} else {
				// Modern invoice: use the dedicated lines endpoint
				try {
					$result = curlJson('GET',
						BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
							. '/posted-sales-invoices/lines/byDocumentNo/' . rawurlencode($invNo)
							. '?pageSize=200',
						$headers
					);
					$lines = array_values(array_filter($result['value'] ?? [], 'is_array'));
				} catch (RuntimeException $e) {
					$lines = [];
				}
			}
			// Enrich lines with Shopify product title/SKU via barcode lookup
			$upcs = array_unique(array_filter(array_map(fn($l) => $l['no'] ?? '', $lines)));
			$productMap = [];
			if ($upcs) {
				$barcodeQuery = implode(' OR ', array_map(fn($b) => 'barcode:' . $b, $upcs));
				$gql = 'query($q:String!){productVariants(first:250,query:$q){nodes{barcode sku product{title handle featuredImage{url}}}}}';
				try {
					$shopifyResp = curlJson('POST',
						'https://' . SHOPIFY_DOMAIN . '/admin/api/2026-01/graphql.json',
						['Content-Type: application/json', 'X-Shopify-Access-Token: ' . SHOPIFY_ADMIN_TOKEN, 'Accept: application/json'],
						json_encode(['query' => $gql, 'variables' => ['q' => $barcodeQuery]])
					);
					foreach ($shopifyResp['data']['productVariants']['nodes'] ?? [] as $v) {
						$bc = $v['barcode'] ?? '';
						if ($bc !== '') $productMap[$bc] = [
							'title'    => $v['product']['title']               ?? '',
							'handle'   => $v['product']['handle']              ?? '',
							'imageUrl' => $v['product']['featuredImage']['url'] ?? null,
							'sku'      => $v['sku']                            ?? '',
						];
					}
				} catch (RuntimeException $e) { /* Non-fatal */ }
			}
			$enriched = array_map(function($l) use ($productMap, $isLegacy) {
				$upc  = $l['no'] ?? '';
				$desc = $l['description'] ?? '';
				$prod = $productMap[$upc] ?? null;
				// Build meta string: SKU and UPC with labels
				if ($prod) {
					$metaParts = [];
					if ($upc) $metaParts[] = 'UPC: ' . $upc;
					if ($prod['sku']) $metaParts[] = 'SKU: ' . $prod['sku'];
				} elseif ($isLegacy) {
					// Legacy: description = "Category : Subcategory : SKU" — extract SKU from last segment
					$descParts    = array_map('trim', explode(':', $desc));
					$extractedSku = count($descParts) > 1 ? end($descParts) : '';
					$metaParts    = [];
					if ($upc) $metaParts[] = 'UPC: ' . $upc;
					if ($extractedSku) $metaParts[] = 'SKU: ' . $extractedSku;
				} else {
					// Modern: description = SKU
					$metaParts = [];
					if ($upc) $metaParts[] = 'UPC: ' . $upc;
					if ($desc) $metaParts[] = 'SKU: ' . $desc;
				}
				return array_merge($l, [
					'title'    => $prod ? $prod['title']    : ($isLegacy ? $desc : 'Unknown product'),
					'meta'     => implode(' · ', $metaParts),
					'imageUrl' => $prod ? ($prod['imageUrl'] ?? null) : null,
					'handle'   => $prod ? ($prod['handle']  ?? '')    : '',
				]);
			}, $lines);
			echo json_encode(['ok' => true, 'lines' => $enriched]);
			break;

		case 'invoice-pdf':
			$invoiceNo = trim((string)($body['invoice_no'] ?? ''));
			if (!$invoiceNo) jsonErr('Missing invoice_no');
			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$headers = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			// Verify ownership using the /byNumber/{no} endpoint
			$inv = bcGet($token,
				'/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices/byNumber/' . rawurlencode($invoiceNo),
				['$select' => 'no,sellToCustomerNo,billToCustomerNo,systemId']
			);
			if (empty($inv)) jsonErr('Invoice not found or access denied', 403);
			$sellTo = $inv['sellToCustomerNo'] ?? '';
			$billTo = $inv['billToCustomerNo'] ?? '';
			verifyInvoiceAccess($sellTo, $billTo, $erpNo, $headers);
			$systemId = trim($inv['systemId'] ?? '');
			if (!$systemId) jsonErr('Invoice system ID unavailable', 500);
			// Fetch PDF by systemId
			$pdf = bcGet($token,
				'/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices/' . rawurlencode($systemId) . '/pdf-document',
				[]
			);
			$content = $pdf['content'] ?? ($pdf['value'][0]['content'] ?? '');
			if (!$content) jsonErr('PDF not available for this invoice', 404);
			echo json_encode([
				'ok'       => true,
				'content'  => $content,
				'filename' => 'Invoice-' . $invoiceNo . '.pdf',
			]);
			break;

		case 'invoice-report':
			$invoiceNo = trim((string)($body['invoice_no'] ?? ''));
			$format    = strtoupper(trim((string)($body['format'] ?? 'PDF')));
			if (!$invoiceNo) jsonErr('Missing invoice_no');
			if (!in_array($format, ['PDF', 'EXCEL'])) jsonErr('Invalid format');
			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$headers = ['Authorization: Bearer ' . $token, 'Accept: application/json'];

			// Determine document type and verify ownership
			$docType  = 'PostedSalesInvoice';
			$isLegacy = false;
			try {
				$inv = bcGet($token,
					'/api/companies/' . BC_COMPANY_ID . '/posted-sales-invoices/byNumber/' . rawurlencode($invoiceNo),
					['$select' => 'no,sellToCustomerNo,billToCustomerNo']
				);
				if (empty($inv['no'])) $isLegacy = true;
				else {
					$sellTo = $inv['sellToCustomerNo'] ?? '';
					$billTo = $inv['billToCustomerNo'] ?? '';
					verifyInvoiceAccess($sellTo, $billTo, $erpNo, $headers);
				}
			} catch (RuntimeException $e) {
				$isLegacy = true;
			}
			if ($isLegacy) {
				$hist = bcGet($token,
					'/api/companies/' . BC_COMPANY_ID . '/sales-invoice-history',
					[
						'$filter' => "no eq '" . str_replace("'", "''", $invoiceNo) . "'",
						'$top'    => '1',
						'$select' => 'no,sellToCustomerNo,billToCustomerNo',
					]
				);
				$histInv = $hist['value'][0] ?? null;
				if (empty($histInv['no'])) jsonErr('Invoice not found', 404);
				$sellTo = $histInv['sellToCustomerNo'] ?? '';
				$billTo = $histInv['billToCustomerNo'] ?? '';
				verifyInvoiceAccess($sellTo, $billTo, $erpNo, $headers);
				$docType = 'SalesInvoiceHistory';
			}
			// Call the report generation endpoint — returns binary directly
			$companyName = 'Valor';
			$reqBody = json_encode([
				'companyName'  => $companyName,
				'documentType' => $docType,
				'documentNo'   => $invoiceNo,
				'format'       => $format,
			]);
			$reportUrl = BC_BASE_URL . '/api/invoice-reports/generate';
			$ch = curl_init($reportUrl);
			curl_setopt_array($ch, [
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_POST           => true,
				CURLOPT_POSTFIELDS     => $reqBody,
				CURLOPT_HTTPHEADER     => [
					'Authorization: Bearer ' . $token,
					'Content-Type: application/json',
					'Accept: application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, */*',
				],
				CURLOPT_TIMEOUT => 30,
			]);
			$raw      = curl_exec($ch);
			$code     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			$curlErr  = curl_error($ch);
			curl_close($ch);

			if ($code !== 200 || !$raw) jsonErr('Report generation failed (HTTP ' . $code . ')', 502);

			$mime = $format === 'PDF'
				? 'application/pdf'
				: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			$ext = strtolower($format === 'PDF' ? 'pdf' : 'xlsx');
			echo json_encode([
				'ok'       => true,
				'content'  => base64_encode($raw),
				'mimeType' => $mime,
				'filename' => 'Invoice-' . $invoiceNo . '.' . $ext,
			]);
			break;

		case 'address-list':
			$erpNo           = $getErpNo();
			$token           = $getBcToken();
			$headers         = ['Authorization: Bearer ' . $token, 'Accept: application/json'];
			$rows            = [];
			$includeChildren = !empty($body['include_children']);

			$allAddrs = getOrgShipToAddresses($erpNo, $headers);
			if ($includeChildren) {
				foreach ($allAddrs as $r) {
					$rows[] = $r;
				}

				// Batch-lookup salesForceId for all unique customer numbers.
				$custNos = array_unique(array_filter(array_column($rows, 'customerNo')));
				if ($custNos) {
					try {
						$batchResp = curlJson('POST',
							BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customers/batch-lookup',
							array_merge($headers, ['Content-Type: application/json']),
							json_encode(['field' => 'no', 'values' => array_values($custNos), 'matchMode' => 'exact', 'select' => 'no,salesForceId'])
						);
						$sfidMap = [];
						foreach ($batchResp['value'] ?? [] as $c) {
							$key = $c['No'] ?? $c['no'] ?? '';
							if ($key !== '') $sfidMap[$key] = $c['salesForceId'] ?? '';
						}
						foreach ($rows as &$r) {
							$r['salesForceId'] = $sfidMap[$r['customerNo'] ?? ''] ?? '';
						}
						unset($r);
					} catch (RuntimeException $batchEx) {
						// Non-fatal — addresses still returned without salesForceId.
					}
				}
			} else {
				// Parent customer only — filter to rows matching erpNo
				foreach ($allAddrs as $r) {
					if (($r['customerNo'] ?? '') !== $erpNo) continue;
					$rows[] = $r;
				}
			}

			echo json_encode(['ok' => true, 'addresses' => array_values($rows), 'erpNo' => $erpNo]);
			break;

		case 'address-update':
			$code     = trim((string)($body['code']      ?? ''));
			$systemId = trim((string)($body['system_id'] ?? ''));
			if (!$code && !$systemId) jsonErr('Missing code or system_id');
			$erpNo      = $getErpNo();
			$token      = $getBcToken();
			$customerNo = trim((string)($body['bc_customer_no'] ?? '')) ?: $erpNo;
			$fields = [];
			foreach (['name','address','address2','city','county','postCode','countryRegionCode','phoneNo'] as $f) {
				if (array_key_exists($f, $body)) $fields[$f] = trim((string)$body[$f]);
			}
			if (empty($fields)) jsonErr('No fields to update');
			// Prefer systemId-based URL (same pattern as address-delete); fall back to OData composite key.
			$patchUrl = $systemId
				? BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/ship-to-addresses/' . urlencode($systemId)
				: BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/ship-to-addresses(CustomerNo=\'' . rawurlencode($customerNo) . '\',Code=\'' . rawurlencode($code) . '\')';
			curlJson('PATCH',
				$patchUrl,
				['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json', 'If-Match: *'],
				json_encode($fields)
			);
			echo json_encode(['ok' => true]);
			break;

		case 'address-create':
			$erpNo  = $getErpNo();
			$token  = $getBcToken();
			$fields = [];
			foreach (['name','address','address2','city','county','postCode','countryRegionCode','phoneNo'] as $f) {
				if (array_key_exists($f, $body)) $fields[$f] = trim((string)$body[$f]);
			}
			if (empty($fields['name'])) jsonErr('Address name is required');

			// Auto-generate next SHP-NNN code
			$codeData = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/ship-to-addresses'
					. '?$filter=' . rawurlencode("customerNo eq '{$erpNo}'") . '&$select=code&$top=500',
				['Authorization: Bearer ' . $token, 'Accept: application/json']
			);
			$maxNum = 0;
			foreach (($codeData['value'] ?? []) as $row) {
				if (is_array($row) && preg_match('/^SHP-(\d+)$/i', $row['code'] ?? '', $m))
					$maxNum = max($maxNum, (int)$m[1]);
			}
			$code = 'SHP-' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);

			curlJson('POST',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/ship-to-addresses',
				['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
				json_encode(array_merge(['customerNo' => $erpNo, 'code' => $code], $fields))
			);
			echo json_encode(['ok' => true, 'address' => array_merge(['code' => $code], $fields)]);
			break;

		case 'address-delete':
			$systemId = trim((string)($body['system_id'] ?? ''));
			if (!$systemId) jsonErr('Missing system_id');
			$token = $getBcToken();
			curlJson('DELETE',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/ship-to-addresses/' . urlencode($systemId),
				['Authorization: Bearer ' . $token, 'Accept: application/json', 'If-Match: *']
			);
			echo json_encode(['ok' => true]);
			break;

		case 'ach-list':
			$erpNo = $getErpNo();
			$token = $getBcToken();
			$raw   = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/byCustomer/' . urlencode($erpNo),
				['Authorization: Bearer ' . $token, 'Accept: application/json']
			);
			$items    = is_array($raw['value'] ?? null) ? $raw['value'] : (is_array($raw) ? $raw : []);
			$accounts = [];
			foreach ($items as $item) {
				if (!is_array($item)) continue;
				if (($item['isActive'] ?? false) !== true) continue;
				$rawType = strtolower($item['accountType'] ?? '');
				$type    = ($rawType === 'creditcard' || $rawType === 'credit card') ? 'CreditCard' : 'ACH';
				$acctNo  = preg_replace('/\D/', '', ($type === 'CreditCard' ? ($item['creditCardNo'] ?? '') : '') ?: ($item['bankAccountNo'] ?? $item['iban'] ?? ''));
				$brand = '';
				// Primary: detect from bankName (most reliable — stored by our code, not masked by BC)
				if ($type === 'CreditCard') {
					$lower = strtolower($item['bankName'] ?? '');
					if     (strpos($lower, 'discover')   !== false) $brand = 'discover';
					elseif (strpos($lower, 'mastercard') !== false) $brand = 'mastercard';
					elseif (strpos($lower, 'amex')       !== false
					     || strpos($lower, 'american')   !== false) $brand = 'amex';
					elseif (strpos($lower, 'visa')       !== false) $brand = 'visa';
				}
				// Fallback: detect from card number (BC may mask digits, so less reliable)
				if (!$brand && $type === 'CreditCard' && $acctNo) {
					if     ($acctNo[0] === '4')                                       $brand = 'visa';
					elseif (preg_match('/^(5[1-5*]|2[2-7*])/', $acctNo))             $brand = 'mastercard';
					elseif (preg_match('/^3[47*]/', $acctNo))                         $brand = 'amex';
					elseif (preg_match('/^(6011|65|64[4-9]|622|6\*)/', $acctNo))     $brand = 'discover';
				}
				$accounts[] = [
					'id'             => $item['systemId'] ?? $item['id'] ?? '',
					'code'           => $item['code'] ?? '',
					'bankName'       => $item['bankName'] ?? $item['name'] ?? '',
					'last4'          => substr($acctNo, -4) ?: null,
					'accountType'    => $type,
					'autoPayForABO'  => !empty($item['autoPayForABO'] ?? null),
					'cardHolderName' => $item['cardHolderName'] ?? '',
					'expirationDate' => $item['expirationDate'] ?? '',
					'brand'          => $brand,
					'zip'            => $item['cardHolderZipCode'] ?? '',
					'nickName'       => $item['nickName'] ?? '',
				];
			}
			echo json_encode(['ok' => true, 'accounts' => $accounts]);
			break;

		case 'cc-set-default':
			$systemId = trim((string)($body['system_id'] ?? ''));
			if (!$systemId) jsonErr('Missing system_id');

			$erpNo   = $getErpNo();
			$token   = $getBcToken();
			$authHdr = ['Authorization: Bearer ' . $token, 'Accept: application/json'];

			// Fetch all accounts to find any currently marked as default
			$raw   = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/byCustomer/' . urlencode($erpNo),
				$authHdr
			);
			$items = is_array($raw['value'] ?? null) ? $raw['value'] : [];

			// Collect IDs that have autoPayForABO = true (excluding the target)
			$clearIds = [];
			foreach ($items as $item) {
				if (!is_array($item)) continue;
				$sid = $item['systemId'] ?? '';
				if ($sid && $sid !== $systemId && !empty($item['autoPayForABO'] ?? null))
					$clearIds[] = $sid;
			}

			// Clear autoPayForABO on previous defaults
			if ($clearIds) {
				curlJson('POST',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/batch-update',
					['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
					json_encode(['systemIds' => $clearIds, 'fields' => ['autoPayForABO' => false]])
				);
			}

			// Set autoPayForABO on the chosen account
			curlJson('PATCH',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/' . urlencode($systemId),
				['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json', 'If-Match: *'],
				json_encode(['autoPayForABO' => true])
			);

			echo json_encode(['ok' => true]);
			break;

		case 'cc-create':
			$holder     = trim((string)($body['holder']      ?? ''));
			$cardNumber = preg_replace('/\D/', '', (string)($body['card_number'] ?? ''));
			$last4      = preg_replace('/\D/', '', (string)($body['last4']       ?? ''));
			$expiry     = trim((string)($body['expiry'] ?? ''));  // MM/YY
			$cvv        = trim((string)($body['cvv']    ?? ''));
			$zip        = trim((string)($body['zip']    ?? ''));
			//$street     = trim((string)($body['street'] ?? ''));
			//$city       = trim((string)($body['city']   ?? ''));
			//$state      = trim((string)($body['state']  ?? ''));
			if (!$holder || strlen($last4) !== 4) jsonErr('Missing required card fields');
			// Use full card number if provided, otherwise fall back to last4
			$creditCardNo = ($cardNumber && strlen($cardNumber) >= 13) ? $cardNumber : $last4;

			$erpNo = $getErpNo();
			$token = $getBcToken();

			// Fetch existing accounts to generate a unique CC-NNN code
			$existingRaw = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/byCustomer/' . urlencode($erpNo),
				['Authorization: Bearer ' . $token, 'Accept: application/json']
			);
			$existing = is_array($existingRaw['value'] ?? null) ? $existingRaw['value'] : [];

			// BC expirationDate is a string field expecting MM/YY format
			$expiryDate = preg_match('/^\d{2}\/\d{2}$/', $expiry) ? $expiry : '';

			// Duplicate check: same last4 + expiry (active = conflict; inactive = reactivate)
			$inactiveCcMatch = null;
			foreach ($existing as $acct) {
				if (!is_array($acct)) continue;
				if (strtolower($acct['accountType'] ?? '') !== 'creditcard') continue;
				$exLast4  = substr(preg_replace('/\D/', '', $acct['creditCardNo'] ?? ''), -4);
				$exExpiry = trim($acct['expirationDate'] ?? '');
				if ($exLast4 !== $last4 || $exExpiry !== $expiry) continue;
				if (($acct['isActive'] ?? false) === true)
					jsonErr('This card is already on file.', 409);
				$inactiveCcMatch = $acct;
			}

			if ($inactiveCcMatch !== null) {
				$existingSystemId = $inactiveCcMatch['SystemId'] ?? $inactiveCcMatch['systemId'] ?? $inactiveCcMatch['id'] ?? null;
				if (!$existingSystemId) jsonErr('Failed to reactivate card', 500);
				$patchFields = ['isActive' => true, 'cardHolderName' => $holder];
				if ($cvv)        $patchFields['cvvCode']          = $cvv;
				if ($zip)        $patchFields['cardHolderZipCode'] = $zip;
				if ($expiryDate) $patchFields['expirationDate']    = $expiryDate;
				curlJson('PATCH',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/' . urlencode($existingSystemId),
					['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
					json_encode($patchFields)
				);
				echo json_encode([
					'ok'           => true,
					'bc_system_id' => $existingSystemId,
					'code'         => $inactiveCcMatch['code'] ?? '',
					'bankName'     => $inactiveCcMatch['bankName'] ?? '',
					'holder'       => $holder,
					'reactivated'  => true,
				]);
				break;
			}

			$maxNum = 0;
			foreach ($existing as $acct) {
				if (!is_array($acct)) continue;
				$codeField = $acct['code'] ?? '';
				if (preg_match('/^CC-(\d+)$/i', $codeField, $m))
					$maxNum = max($maxNum, (int)$m[1]);
			}
			$code     = 'CC-' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
			$brandName = preg_match('/^4/', $creditCardNo) ? 'Visa'
				: (preg_match('/^(5[1-5]|2[2-7])/', $creditCardNo) ? 'Mastercard'
				: (preg_match('/^3[47]/', $creditCardNo) ? 'Amex'
				: (preg_match('/^(6011|65|64[4-9]|622)/', $creditCardNo) ? 'Discover' : 'Card')));
			$bankName = $brandName . ' ••••' . $last4;

			$payload = [
				'accountType'    => 'CreditCard',
				'customerNo'     => $erpNo,
				'code'           => $code,
				'bankName'       => $bankName,
				'creditCardNo'   => $creditCardNo,
				'cardHolderName' => $holder,
			];
			if ($cvv)        $payload['cvvCode']           = $cvv;
			if ($zip)        $payload['cardHolderZipCode']  = $zip;
			//if ($street)   $payload['cardHolderStreetNo'] = $street;
			//if ($city)     $payload['cardHolderCity']     = $city;
			//if ($state)    $payload['cardHolderState']    = $state;
			if ($expiryDate) $payload['expirationDate']     = $expiryDate;

			$result = curlJson('POST',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts',
				['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
				json_encode($payload)
			);

			$systemId = $result['SystemId'] ?? $result['systemId'] ?? $result['id'] ?? null;
			if (!$systemId) jsonErr('Failed to create credit card record', 500);

			echo json_encode([
				'ok'           => true,
				'bc_system_id' => $systemId,
				'code'         => $code,
				'bankName'     => $bankName,
				'holder'       => $holder,
			]);
			break;

		case 'ach-create':
			$routing  = trim((string)($body['routing']   ?? ''));
			$account  = trim((string)($body['account']   ?? ''));
			$holder   = trim((string)($body['holder']    ?? ''));
			$nickName = trim((string)($body['nick_name'] ?? $body['nickName'] ?? ''));
			if (!$routing || !$account || !$holder) jsonErr('Missing routing, account, or holder');

			$erpNo    = $getErpNo();
			$token    = $getBcToken();

			// Fetch existing accounts for duplicate check + code generation
			$existingRaw = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/byCustomer/' . urlencode($erpNo),
				['Authorization: Bearer ' . $token, 'Accept: application/json']
			);
			$existing = is_array($existingRaw['value'] ?? null) ? $existingRaw['value'] : (is_array($existingRaw) ? $existingRaw : []);

			// Check for existing record (active = conflict; inactive = reactivate instead of creating duplicate)
			// Compare full account number (not just last-4) to avoid false matches between different accounts sharing the same last digits.
			$normalizedAccount = preg_replace('/\D/', '', $account);
			$inactiveMatch = null;
			foreach ($existing as $acct) {
				if (!is_array($acct)) continue;
				$acctNo  = preg_replace('/\D/', '', $acct['bankAccountNo'] ?? '');
				$transit = $acct['transitNo'] ?? '';
				if ($acctNo !== $normalizedAccount || $transit !== $routing) continue;
				if (($acct['isActive'] ?? false) === true)
					jsonErr('This bank account is already on file.', 409);
				$inactiveMatch = $acct;
			}

			// Reactivate existing inactive record rather than creating a duplicate
			if ($inactiveMatch !== null) {
				$existingSystemId = $inactiveMatch['SystemId'] ?? $inactiveMatch['systemId'] ?? $inactiveMatch['id'] ?? null;
				if (!$existingSystemId) jsonErr('Failed to reactivate bank account', 500);
				$patchResult = curlJson('PATCH',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/' . urlencode($existingSystemId),
					['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
					json_encode(['isActive' => true, 'nickName' => $nickName, 'holderName' => $holder])
				);
				$systemId = $patchResult['SystemId'] ?? $patchResult['systemId'] ?? $patchResult['id'] ?? $existingSystemId;
				$code = $inactiveMatch['code'] ?? '';
				echo json_encode([
					'ok'           => true,
					'bc_system_id' => $systemId,
					'code'         => $code,
					'bankName'     => 'Bank account',
					'reactivated'  => true,
				]);
				break;
			}

			// Generate unique ACH-NNN code
			$maxNum = 0;
			foreach ($existing as $acct) {
				$codeField = $acct['code'] ?? '';
				if (preg_match('/^ACH-(\d+)$/i', $codeField, $m))
					$maxNum = max($maxNum, (int)$m[1]);
			}
			$code = 'ACH-' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);

			$result = curlJson('POST',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts',
				['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
				json_encode([
					'customerNo'    => $erpNo,
					'code'          => $code,
					'bankAccountNo' => $account,
					'transitNo'     => $routing,
					'bankName'      => 'Bank account',
					'accountType'   => 'ACH',
					'nickName'      => $nickName,
				])
			);

			$systemId = $result['SystemId'] ?? $result['systemId'] ?? $result['id'] ?? null;
			if (!$systemId) jsonErr('Failed to create bank account', 500);

			echo json_encode([
				'ok'           => true,
				'bc_system_id' => $systemId,
				'code'         => $code,
				'bankName'     => 'Bank account',
				'last4'        => substr($normalizedAccount, -4),
				'nickName'     => $nickName,
			]);
			break;

		case 'ach-delete':
			$systemId = trim((string)($body['system_id'] ?? ''));
			if (!$systemId) jsonErr('Missing system_id');

			$token = $getBcToken();
			curlJson('PATCH',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-accounts/' . urlencode($systemId),
				['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'],
				json_encode(['isActive' => false])
			);
			echo json_encode(['ok' => true]);
			break;

		case 'ach-perm-list':
			// Returns current permission maps + child companies for this bank account.
			$bankAccountSystemId = trim((string)($body['bank_account_system_id'] ?? ''));
			if (!$bankAccountSystemId) jsonErr('Missing bank_account_system_id');

			$erpNo  = $getErpNo();
			$token  = $getBcToken();
			$hdrs   = ['Authorization: Bearer ' . $token, 'Accept: application/json'];

			// Current permission maps for this bank account (filter by customerBankAccountSystemId).
			$mapsUrl = BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
				. '/customer-bank-account-maps?$filter=' . rawurlencode("customerBankAccountSystemId eq " . $bankAccountSystemId);
			$mapsRaw = [];
			$mapsErr = null;
			try {
				$mapsRaw = curlJson('GET', $mapsUrl, $hdrs);
			} catch (RuntimeException $e) {
				$mapsErr = $e->getMessage();
			}
			if ($mapsErr !== null) {
				echo json_encode(['ok' => false, 'error' => $mapsErr]);
				break;
			}
			$maps = [];
			foreach ($mapsRaw['value'] ?? [] as $m) {
				if (!is_array($m) || empty($m['customerNo'])) continue;
				if (($m['isActive'] ?? false) !== true) continue;
				$maps[] = ['systemId' => $m['systemId'] ?? '', 'customerNo' => $m['customerNo']];
			}

			// Child customers via ship-to-addresses (cached, with live fallback)
			$childNos       = [];
			$firstAddrByCno = [];
			$addrRows = getOrgShipToAddresses($erpNo, $hdrs);
			foreach ($addrRows as $r) {
				if (!is_array($r)) continue;
				$cno = $r['CustomerNo'] ?? $r['customerNo'] ?? '';
				if ($cno && $cno !== $erpNo) {
					$childNos[$cno] = true;
					if (!isset($firstAddrByCno[$cno])) $firstAddrByCno[$cno] = $r;
				}
			}

			// Build children list using first ship-to address for each child customer
			$children = [];
			foreach (array_keys($childNos) as $cno) {
				$r     = $firstAddrByCno[$cno] ?? [];
				$parts = array_filter([
					$r['name']     ?? $r['Name']     ?? '',
					$r['address']  ?? $r['Address']  ?? '',
					$r['city']     ?? $r['City']      ?? '',
					trim(($r['county'] ?? $r['County'] ?? '') . ' ' . ($r['postCode'] ?? $r['PostCode'] ?? '')),
				]);
				$children[] = ['customerNo' => $cno, 'name' => $parts ? implode(', ', $parts) : $cno];
			}

			echo json_encode(['ok' => true, 'maps' => $maps, 'children' => $children]);
			break;

		case 'ach-perm-save':
			$bankAccountSystemId = trim((string)($body['bank_account_system_id'] ?? ''));
			$toAdd    = is_array($body['to_add'])    ? array_values($body['to_add'])    : [];
			$toDelete = is_array($body['to_delete']) ? array_values($body['to_delete']) : [];
			if (!$bankAccountSystemId) jsonErr('Missing bank_account_system_id');

			$erpNo = $getErpNo();
			$token = $getBcToken();
			$hdrs  = ['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'];

			// Fetch all existing maps (including inactive) for this bank account to detect reactivations.
			$allMapsRaw = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
					. '/customer-bank-account-maps?$filter=' . rawurlencode("customerBankAccountSystemId eq " . $bankAccountSystemId),
				['Authorization: Bearer ' . $token, 'Accept: application/json']
			);
			$activeByNo = [];
			$inactiveByNo = [];
			foreach ($allMapsRaw['value'] ?? [] as $m) {
				if (!is_array($m) || empty($m['customerNo'])) continue;
				$cno = $m['customerNo'];
				if (($m['isActive'] ?? false) === true) {
					$activeByNo[$cno] = $m['systemId'] ?? '';
				} else {
					$inactiveByNo[$cno] = $m['systemId'] ?? '';
				}
			}

			$toCreate = [];
			if (empty($activeByNo[ACH_PERMISSION_SENTINEL_CUSTOMER_NO])) {
				if (!empty($inactiveByNo[ACH_PERMISSION_SENTINEL_CUSTOMER_NO])) {
					curlJson('PATCH',
						BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-account-maps/' . urlencode($inactiveByNo[ACH_PERMISSION_SENTINEL_CUSTOMER_NO]),
						$hdrs, json_encode(['isActive' => true])
					);
				} else {
					$toCreate[] = ['customerNo' => ACH_PERMISSION_SENTINEL_CUSTOMER_NO, 'customerBankAccountSystemId' => $bankAccountSystemId];
				}
			}

			foreach ($toAdd as $cno) {
				if ($cno === ACH_PERMISSION_SENTINEL_CUSTOMER_NO || isset($activeByNo[$cno])) continue;
				if (isset($inactiveByNo[$cno]) && $inactiveByNo[$cno]) {
					// Reactivate existing inactive map.
					curlJson('PATCH',
						BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-account-maps/' . urlencode($inactiveByNo[$cno]),
						$hdrs, json_encode(['isActive' => true])
					);
				} else {
					$toCreate[] = ['customerNo' => $cno, 'customerBankAccountSystemId' => $bankAccountSystemId];
				}
			}
			if (!empty($toCreate)) {
				curlJson('POST',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-account-maps/batch-create',
					$hdrs, json_encode($toCreate)
				);
			}

			if (!empty($toDelete)) {
				// curlJson('POST',
				// 	BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-account-maps/batch-delete',
				// 	$hdrs, json_encode($toDelete)
				// );
				foreach ($toDelete as $mapSystemId) {
					if (!empty($activeByNo[ACH_PERMISSION_SENTINEL_CUSTOMER_NO]) && $mapSystemId === $activeByNo[ACH_PERMISSION_SENTINEL_CUSTOMER_NO]) continue;
					curlJson('PATCH',
						BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/customer-bank-account-maps/' . urlencode($mapSystemId),
						$hdrs, json_encode(['isActive' => false])
					);
				}
			}

			echo json_encode(['ok' => true]);
			break;

		case 'user-list':
			$erpNo = $getErpNo();
			$token = $getBcToken();
			$hdrs  = ['Authorization: Bearer ' . $token, 'Accept: application/json'];

			$raw = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
					. '/web-users?$filter=' . rawurlencode("customerNo eq '" . addslashes($erpNo) . "' and isActive eq true")
					. '&$select=email,name,isActive',
				$hdrs
			);
			$users = [];
			foreach ($raw['value'] ?? [] as $u) {
				if (!is_array($u) || empty($u['email'])) continue;
				$domain = strtolower(substr($u['email'], strrpos($u['email'], '@') + 1));
				if ($domain === 'valorcomm.com' || $domain === 'ondigo.com') continue;
				if (strtolower($u['email']) === 'muhammadtouseefmughal@gmail.com') continue;
				$users[] = ['email' => $u['email'], 'name' => $u['name'] ?? ''];
			}

			echo json_encode(['ok' => true, 'users' => $users]);
			break;

		case 'user-perm-list':
			$email = trim((string)($body['customer_email'] ?? ''));
			if (!$email) jsonErr('Missing customer_email');

			$token = $getBcToken();
			$hdrs  = ['Authorization: Bearer ' . $token, 'Accept: application/json'];

			$linksRaw = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID
					. '/web-user-customer-links?$filter=' . rawurlencode("email eq '" . addslashes($email) . "'"),
				$hdrs
			);
			$links = [];
			foreach ($linksRaw['value'] ?? [] as $l) {
				if (!is_array($l) || empty($l['customerNo'])) continue;
				$links[] = ['systemId' => $l['systemId'] ?? '', 'customerNo' => $l['customerNo'] ?? ''];
			}

			echo json_encode(['ok' => true, 'links' => $links]);
			break;

		case 'user-perm-save':
			$email    = trim((string)($body['customer_email'] ?? ''));
			$toAdd    = is_array($body['to_add'])    ? array_values($body['to_add'])    : [];
			$toDelete = is_array($body['to_delete']) ? array_values($body['to_delete']) : [];
			if (!$email) jsonErr('Missing customer_email');

			$token = $getBcToken();
			$hdrs  = ['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json'];

			if (!empty($toAdd)) {
				$items = array_map(function ($cno) use ($email) {
					return ['email' => $email, 'customerNo' => $cno, 'isActive' => true];
				}, $toAdd);
				curlJson('POST',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/web-user-customer-links/batch-create',
					$hdrs, json_encode($items)
				);
			}

			if (!empty($toDelete)) {
				curlJson('POST',
					BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/web-user-customer-links/batch-delete',
					$hdrs, json_encode($toDelete)
				);
			}

			echo json_encode(['ok' => true]);
			break;

		case 'cc-authorize-order':
			$orderNo  = trim((string)($body['order_id']               ?? ''));
			$systemId = trim((string)($body['bank_account_system_id'] ?? ''));

			if (!$orderNo)  jsonErr('Missing order_id');
			if (!$systemId) jsonErr('Missing bank_account_system_id');

			$erpNo   = $getErpNo();
			$bcToken = $getBcToken();
			$bcHdr   = ['Authorization: Bearer ' . $bcToken, 'Content-Type: application/json', 'Accept: application/json'];

			// Verify the order belongs to this customer and is awaiting payment
			$bcOrder = curlJson('GET',
				BC_BASE_URL . '/api/companies/' . BC_COMPANY_ID . '/sales-orders/byNumber/' . urlencode($orderNo),
				$bcHdr
			);
			if (empty($bcOrder['no'])) jsonErr('Order not found', 404);
			$orderCustNo = $bcOrder['sellToCustomerNo'] ?? '';
			verifyOrderAccess($orderCustNo, $erpNo, $bcHdr);
			if (($bcOrder['orderStatus'] ?? '') !== 'ORDER_ON_CREDIT_HOLD') jsonErr('Order is not awaiting payment authorization', 400);

			// Call Payment Gateway to authorize with stored card
			//error_log('[url]: ' . GW_BASE_URL . '/api/credit_card/authorize_with_saved_card/' . urlencode($orderNo));
			//error_log('[body]: ' . json_encode(['customerBankAccountSystemId' => $systemId]));
			$gwToken = $getGwToken();
			$gwResp  = curlJson('POST',
				GW_BASE_URL . '/api/credit_card/authorize_with_saved_card/' . urlencode($orderNo),
				['Authorization: Bearer ' . $gwToken, 'Content-Type: application/json', 'Accept: application/json'],
				json_encode(['customerBankAccountSystemId' => $systemId])
			);

			if (($gwResp['code'] ?? '') !== 'SUCCESS')
				jsonErr($gwResp['description'] ?? 'Authorization failed', 422);

			echo json_encode(['ok' => true, 'description' => $gwResp['description'] ?? 'Authorized']);
			break;

		/*case 'customer-sync':
			// Trigger ERP → Shopify company sync for the authenticated customer.
			// The email is passed from Liquid (customer.email, server-rendered — not user input).
			$email = trim((string)($body['email'] ?? ''));
			if (!$email) jsonErr('Missing email', 400);
			if (!CUSTSYNC_KEY) jsonErr('Customer sync not configured', 503);

			$syncUrl = CUSTSYNC_BASE_URL . '/api/customer-sync/by-email?code=' . urlencode(CUSTSYNC_KEY);
			$syncPayload = json_encode(['email' => $email]);
			$syncResp = curlJson('POST', $syncUrl,
				['Content-Type: application/json'],
				$syncPayload
			);
			echo json_encode(['ok' => true, 'sync' => $syncResp]);
			break;
		*/

		// ── Saved carts (MySQL) ────────────────────────────────────────────────
		case 'saved-carts-list':
			$erpNo = $getErpNo();
			$scope = trim((string)($body['scope'] ?? 'mine'));

			if ($scope === 'org') {
				$token     = $getBcToken();
				$orgErpNos = [$erpNo => true];
				$nameByErp = [];
				$addrRows  = getOrgShipToAddresses($erpNo, ['Authorization: Bearer ' . $token, 'Accept: application/json']);
				foreach ($addrRows as $r) {
					if (!is_array($r)) continue;
					$cno = $r['CustomerNo'] ?? $r['customerNo'] ?? '';
					if (!$cno) continue;
					$orgErpNos[$cno] = true;
					if (!isset($nameByErp[$cno])) {
						$parts = array_filter([
							$r['name']    ?? $r['Name']    ?? '',
							$r['address'] ?? $r['Address'] ?? '',
							$r['city']    ?? $r['City']    ?? '',
						]);
						$nameByErp[$cno] = $parts ? implode(', ', $parts) : $cno;
					}
				}
				$in   = implode(',', array_map(fn($e) => '"' . sql_escape($e) . '"', array_keys($orgErpNos)));
				$rows = sql_get(
					'SELECT name, saved_at, JSON_LENGTH(items) AS item_count, erp_no AS owner_erp_no FROM saved_carts ' .
					'WHERE shop = "' . sql_escape($shopName) . '" AND erp_no IN (' . $in . ') ' .
					'ORDER BY saved_at DESC'
				);
				foreach ($rows as &$row) {
					$ownerErp          = $row['owner_erp_no'] ?? '';
					$row['owner_name'] = ($ownerErp === $erpNo) ? null : ($nameByErp[$ownerErp] ?? $ownerErp);
				}
				unset($row);
			} else {
				$rows = sql_get(
					'SELECT name, saved_at, JSON_LENGTH(items) AS item_count, erp_no AS owner_erp_no FROM saved_carts ' .
					'WHERE shop = "' . sql_escape($shopName) . '" AND erp_no = "' . sql_escape($erpNo) . '" ' .
					'ORDER BY saved_at DESC'
				);
			}
			echo json_encode(['ok' => true, 'carts' => $rows ?: []]);
			break;

		case 'saved-carts-save':
			$erpNo = $getErpNo();
			$name  = trim((string)($body['name'] ?? ''));
			$items = $body['items'] ?? [];
			if (!$name)            jsonErr('Missing cart name');
			if (!is_array($items)) jsonErr('Invalid items');
			sql_set(
				'INSERT INTO saved_carts (shop, erp_no, name, items) VALUES (' .
				'"' . sql_escape($shopName) . '","' . sql_escape($erpNo) . '","' . sql_escape($name) . '","' . sql_escape(json_encode($items)) . '") ' .
				'ON DUPLICATE KEY UPDATE items = VALUES(items), saved_at = CURRENT_TIMESTAMP'
			);
			echo json_encode(['ok' => true]);
			break;

		case 'saved-carts-load':
			$erpNo    = $getErpNo();
			$name     = trim((string)($body['name']          ?? ''));
			$ownerErp = trim((string)($body['owner_erp_no']  ?? '')) ?: $erpNo;
			if (!$name) jsonErr('Missing cart name');
			// Validate cross-org access: ownerErp must be within the current user's org
			if ($ownerErp !== $erpNo) {
				$token   = $getBcToken();
				$allowed = getOrgCustomerNos($erpNo, ['Authorization: Bearer ' . $token, 'Accept: application/json']);
				if (!isset($allowed[$ownerErp])) jsonErr('Cart not found', 404);
			}
			$rows = sql_get(
				'SELECT items FROM saved_carts ' .
				'WHERE shop = "' . sql_escape($shopName) . '" AND erp_no = "' . sql_escape($ownerErp) . '" AND name = "' . sql_escape($name) . '" LIMIT 1'
			);
			if (empty($rows)) jsonErr('Cart not found', 404);
			echo json_encode(['ok' => true, 'items' => json_decode($rows[0]['items'], true) ?? []]);
			break;

		case 'saved-carts-delete':
			$erpNo = $getErpNo();
			$name  = trim((string)($body['name'] ?? ''));
			if (!$name) jsonErr('Missing cart name');
			sql_set(
				'DELETE FROM saved_carts ' .
				'WHERE shop = "' . sql_escape($shopName) . '" AND erp_no = "' . sql_escape($erpNo) . '" AND name = "' . sql_escape($name) . '"'
			);
			echo json_encode(['ok' => true]);
			break;

		default:
			jsonErr("Unknown action '{$action}'");
	}
}
catch (RuntimeException $e)
{
	//error_log("[proxy] action={$action} customer={$customerId} ERROR: " . $e->getMessage(). ' @ ' . $e->getFile() . ':' . $e->getLine());
	$log = sys_get_temp_dir() . '/valor_proxy_error.log';
	file_put_contents($log,
		date('Y-m-d H:i:s') . " action={$action} customer={$customerId}: " . $e->getMessage()
		. ' @ ' . $e->getFile() . ':' . $e->getLine() . "\n",
		FILE_APPEND
	);
	http_response_code(500);
	$errMsg = $e->getMessage() === '__TIMEOUT__' ? 'Service temporarily unavailable. Please try again.' : $e->getMessage();
	echo json_encode([
		'ok'    => false,
		'error' => $errMsg,
		'debug' => [
			'action'   => $action,
			'customer' => $customerId,
			'file'     => basename($e->getFile()),
			'line'     => $e->getLine(),
		],
	]);
	exit;
}










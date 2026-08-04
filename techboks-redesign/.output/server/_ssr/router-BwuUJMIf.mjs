import { a as __toESM } from "../_runtime.mjs";
import { a as useMotionValue, c as AnimatePresence, i as useTransform, n as useAnimationFrame, o as useScroll, r as useSpring, t as useVelocity } from "../_libs/framer-motion.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as createFileRoute, h as useRouter, k as notFound, m as Link, p as createRootRouteWithContext, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as ArrowUpRight, a as Search, b as ArrowDown, c as Minus, d as MapPin, f as Leaf, g as Boxes, h as Check, i as ShieldCheck, l as MessageCircle, m as Instagram, n as Trash2, o as Rows3, p as LayoutGrid, r as ShoppingBag, s as Plus, t as X, u as Menu, v as ArrowRight, y as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BwuUJMIf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CwDX0nyW.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var homey_pro_cover_default = "/assets/homey-pro-cover-CyUmjIxX.jpg";
var img = (file) => `https://www.techboks.dk/images/${file}`;
var categories = [{
	id: "mustang-mach-e",
	name: "Mustang Mach-E",
	slug: "mustang-mach-e",
	tagline: "Bilgadgets",
	description: "Specialdesignede tilbehør og praktiske gadgets, målt op efter din Ford Mustang Mach-E.",
	image: img("mustang_collage.jpg")
}, {
	id: "hjemmet",
	name: "Hjemmet",
	slug: "hjemmet",
	tagline: "Smarte løsninger",
	description: "Diskrete, funktionelle produkter der løser små irritationsmomenter derhjemme.",
	image: homey_pro_cover_default
}];
var petg = [
	{
		label: "Materiale",
		value: "PETG — varmebestandig"
	},
	{
		label: "Produktion",
		value: "Printet i Danmark"
	},
	{
		label: "Leveringstid",
		value: "3–7 hverdage"
	}
];
var colorOption = {
	label: "Farve",
	values: [
		"Sort",
		"Hvid",
		"Rød",
		"Blå",
		"Grøn"
	]
};
var products = [
	{
		id: "tb-001",
		slug: "center-konsol-boks",
		name: "Center Konsol Boks",
		shortDescription: "Organiser din midterkonsol under armlænet",
		description: "Organiser dine ting i midterkonsollen med denne specialdesignede boks til Mustang Mach-E. Den passer præcist ned i rummet under armlænet, og der medfølger en kortholder til fx ladekort og ladebrikker.",
		category: "mustang-mach-e",
		price: 90,
		currency: "DKK",
		images: [
			img("centerConsol1.jpg"),
			img("centerConsol2.jpg"),
			img("centerConsol3.jpg"),
			img("centerConsol4.png")
		],
		specifications: [...petg, {
			label: "Anvendelse",
			value: "Placeres i midterkonsollen under armlænet"
		}],
		options: [colorOption],
		featured: true
	},
	{
		id: "tb-002",
		slug: "front-boks",
		name: "Front Boks",
		shortDescription: "Udnyt pladsen oppe foran frontskærmen",
		description: "Udnyt det ubrugte rum foran frontskærmen. Front Boksen giver dig et diskret opbevaringsrum til småting, som ellers ville rulle rundt i kabinen.",
		category: "mustang-mach-e",
		price: 90,
		currency: "DKK",
		images: [img("frontBox1.jpg")],
		specifications: [...petg, {
			label: "Anvendelse",
			value: "Monteres foran frontskærmen"
		}],
		options: [colorOption],
		featured: true
	},
	{
		id: "tb-003",
		slug: "vinter-cover",
		name: "Vinter Cover",
		shortDescription: "Beskyt ladeporten mod sne, is og skidt",
		description: "Et tætsluttende cover der beskytter din Mustang Mach-E's ladeport mod sne, is og vejsalt i vintermånederne.",
		category: "mustang-mach-e",
		price: 90,
		currency: "DKK",
		images: [img("vinterCover1.jpg")],
		specifications: [...petg, {
			label: "Anvendelse",
			value: "Sættes over ladeporten"
		}],
		options: [colorOption],
		featured: true
	},
	{
		id: "tb-004",
		slug: "mustang-6-pack-daaseholder",
		name: "Mustang 6-pack til Dåser",
		shortDescription: "Unik 6-pack holder — ta' drikkevarerne med på farten",
		description: "En holder til seks dåser med Mustang-detalje. Holder drikkevarerne på plads under kørsel og fungerer lige så godt som bordholder til grillaftenen.",
		category: "mustang-mach-e",
		price: 150,
		currency: "DKK",
		images: [img("case6pack4.jpg")],
		specifications: [...petg, {
			label: "Kapacitet",
			value: "6 standard dåser"
		}],
		options: [colorOption],
		featured: true
	},
	{
		id: "tb-005",
		slug: "ladekabel-ophaeng-std",
		name: "Ladekabel Ophæng (Std)",
		shortDescription: "Ophæng til almindeligt ladekabel",
		description: "Hold ladekablet oppe fra gulvet og undgå snavs og knæk. Passer til standard ladekabler.",
		category: "mustang-mach-e",
		price: 90,
		currency: "DKK",
		images: [img("ladekabel_hvid.jpg")],
		specifications: [...petg, {
			label: "Montering",
			value: "Skrues på væg"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-006",
		slug: "ladekabel-ophaeng-large",
		name: "Ladekabel Ophæng (Large)",
		shortDescription: "Ophæng til langt ladekabel",
		description: "Den store udgave af vores kabelophæng, dimensioneret til lange og tykke ladekabler.",
		category: "mustang-mach-e",
		price: 150,
		currency: "DKK",
		images: [img("ladekabel_large1.jpg")],
		specifications: [...petg, {
			label: "Montering",
			value: "Skrues på væg"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-007",
		slug: "anhaengertraek-prop",
		name: "Anhængertræk Prop",
		shortDescription: "Beskyt og pynt dit anhængertræk",
		description: "En prop med Mustang-motiv der beskytter anhængertrækkets kugle mod snavs — og giver et pænere udtryk.",
		category: "mustang-mach-e",
		price: 40,
		currency: "DKK",
		images: [img("anhangerProp.jpg")],
		specifications: [...petg, {
			label: "Anvendelse",
			value: "Sættes på anhængertrækket"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-008",
		slug: "hattehylde-clips",
		name: "Hattehylde Clips",
		shortDescription: "Fastgør hattehylden sikkert. Pris for 2 stk.",
		description: "Praktiske clips der holder hattehylden sikkert på plads, så den ikke rasler under kørsel. Sælges i sæt af to.",
		category: "mustang-mach-e",
		price: 40,
		currency: "DKK",
		images: [img("hattehyldeClips1.jpg")],
		specifications: [...petg, {
			label: "Indhold",
			value: "2 stk."
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-009",
		slug: "skraldespand-sidedoer",
		name: "Skraldespand til Sidedør",
		shortDescription: "Smart skraldespand til sidedøren",
		description: "En kompakt skraldespand der monteres i sidedørens lomme. Hold bilen ren og ryddelig uden løse poser.",
		category: "mustang-mach-e",
		price: 70,
		currency: "DKK",
		images: [img("trashBin1.jpg")],
		specifications: [...petg, {
			label: "Montering",
			value: "Placeres i sidedørens lomme"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-010",
		slug: "nakkestoette-krog",
		name: "Nakkestøtte Krog",
		shortDescription: "Krog til tasker, bøjler og indkøbsposer",
		description: "Monteres på nakkestøttens stænger og giver et solidt ophæng til indkøbsposer, tasker eller bøjler.",
		category: "mustang-mach-e",
		price: 40,
		currency: "DKK",
		images: [img("nakkestotteKrog3.jpg")],
		specifications: [...petg, {
			label: "Montering",
			value: "Klikkes på nakkestøttens stænger"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-011",
		slug: "bagagerum-krog",
		name: "Bagagerum Krog",
		shortDescription: "Praktisk krog til bagagerummet. Pris for 2 stk.",
		description: "Hæng paraplyen op eller fastgør ting i bagagerummet. Sælges i sæt af to og monteres uden værktøj.",
		category: "mustang-mach-e",
		price: 60,
		currency: "DKK",
		images: [img("bagagerumkrog.jpg")],
		specifications: [...petg, {
			label: "Indhold",
			value: "2 stk."
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-012",
		slug: "front-boks-mobil-mount",
		name: "Front Boks Mobil-mount",
		shortDescription: "Mount til mobilholder på front boksen",
		description: "Tilbehør til Front Boksen: en mount der lader dig montere en almindelig mobilholder i synsfeltet.",
		category: "mustang-mach-e",
		price: 40,
		currency: "DKK",
		images: [img("frontBoxPhone.jpg")],
		specifications: [...petg, {
			label: "Kræver",
			value: "Front Boks"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-013",
		slug: "skillerum-bagagerum",
		name: "Skillerum til Bagagerum",
		shortDescription: "Hold tingene på plads i bagagerummet",
		description: "Skillerum der deler bagagerummet op i faste zoner, så indkøbene ikke vælter rundt på vej hjem.",
		category: "mustang-mach-e",
		price: 60,
		currency: "DKK",
		images: [img("floorHolder1.jpg")],
		specifications: [...petg, {
			label: "Anvendelse",
			value: "Placeres i bagagerummet"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-014",
		slug: "hattehylde-ophaengskrog",
		name: "Hattehylde Ophængskrog",
		shortDescription: "Reservedel — hvis din originale er knækket",
		description: "Forstærket ophængskrog til hattehylden. En direkte erstatning for den originale, hvis den er knækket.",
		category: "mustang-mach-e",
		price: 80,
		currency: "DKK",
		images: [img("hattehyldeMount.jpg")],
		specifications: [...petg, {
			label: "Type",
			value: "Reservedel"
		}],
		options: [colorOption],
		featured: false
	},
	{
		id: "tb-015",
		slug: "mustang-logo-template",
		name: "Mustang Logo Template",
		shortDescription: "Skabelon med Mustang Mach-E logo",
		description: "Skabelon med Mustang Mach-E logo — perfekt til at markere gulvmåtter eller andre projekter præcist.",
		category: "mustang-mach-e",
		price: 70,
		currency: "DKK",
		images: [img("gulvmattetemplate.jpg")],
		specifications: [...petg, {
			label: "Anvendelse",
			value: "Skabelon / stencil"
		}],
		featured: false
	},
	{
		id: "tb-016",
		slug: "homey-pro-cover",
		name: "Homey Pro Cover",
		shortDescription: "Cover til Homey Pro 23 og 26 — bedre luftcirkulation",
		description: "Et ventileret cover til Homey Pro (2023 og 2026), der forbedrer luftcirkulationen og holder enheden køligere — uden at gå på kompromis med udtrykket.",
		category: "hjemmet",
		price: 40,
		currency: "DKK",
		images: [homey_pro_cover_default],
		specifications: [...petg, {
			label: "Passer til",
			value: "Homey Pro 23 / 26"
		}],
		options: [colorOption],
		featured: true
	}
];
function getCategory(id) {
	return categories.find((c) => c.id === id);
}
function getRelatedProducts(product, limit = 3) {
	return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}
function formatPrice(value) {
	return `${value.toLocaleString("da-DK")} kr.`;
}
var CartContext = (0, import_react.createContext)(null);
var STORAGE_KEY = "techboks-cart-v1";
var sameLine = (l, productId, variant) => l.productId === productId && (l.variant ?? "") === (variant ?? "");
function CartProvider({ children }) {
	const [lines, setLines] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) setLines(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
		} catch {}
	}, [lines]);
	const value = (0, import_react.useMemo)(() => {
		const views = lines.flatMap((line) => {
			const product = products.find((p) => p.id === line.productId);
			if (!product) return [];
			return [{
				...line,
				product,
				lineTotal: product.price * line.quantity
			}];
		});
		return {
			lines: views,
			count: views.reduce((sum, l) => sum + l.quantity, 0),
			total: views.reduce((sum, l) => sum + l.lineTotal, 0),
			add: (productId, quantity = 1, variant) => setLines((prev) => {
				if (prev.find((l) => sameLine(l, productId, variant))) return prev.map((l) => sameLine(l, productId, variant) ? {
					...l,
					quantity: l.quantity + quantity
				} : l);
				return [...prev, {
					productId,
					quantity,
					variant
				}];
			}),
			remove: (productId, variant) => setLines((prev) => prev.filter((l) => !sameLine(l, productId, variant))),
			setQuantity: (productId, quantity, variant) => setLines((prev) => quantity <= 0 ? prev.filter((l) => !sameLine(l, productId, variant)) : prev.map((l) => sameLine(l, productId, variant) ? {
				...l,
				quantity
			} : l)),
			clear: () => setLines([])
		};
	}, [lines]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const ctx = (0, import_react.useContext)(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
var logo_mark_c_default = "/assets/logo-mark-c-DSRcbsZu.png";
function Logo({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: `flex shrink-0 items-center gap-2.5 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo_mark_c_default,
			alt: "",
			width: 40,
			height: 40,
			className: "h-9 w-9",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-lg font-semibold tracking-tight text-ink",
			children: ["Tech", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "Boks"
			})]
		})]
	});
}
/** Unified cart card — used by the sticky product-page rail and the header dropdown. */
function CartPanel({ onNavigate }) {
	const { lines, count, total } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-blob-lg bg-surface flex max-h-[calc(100dvh-8rem)] flex-col overflow-hidden shadow-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-ink px-5 py-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-canvas text-2xl font-semibold tracking-tight",
						children: "Indkøbskurv"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
						initial: {
							scale: .7,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: {
							type: "spring",
							stiffness: 380,
							damping: 18
						},
						className: "text-canvas/60 text-xs font-medium tracking-wide",
						children: [
							count,
							" ",
							count === 1 ? "vare" : "varer"
						]
					}, count)]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					children: lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						className: "border-ink/10 text-muted-foreground rounded-blob border border-dashed p-5 text-sm leading-relaxed",
						children: "Kurven er tom. Klik dig ind på et produkt, vælg farve og antal — og læg det i kurven."
					}, "empty") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
							layout: true,
							initial: {
								opacity: 0,
								x: 24
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: 24
							},
							transition: {
								type: "spring",
								stiffness: 300,
								damping: 28
							},
							className: "bg-canvas rounded-blob flex items-center gap-3 p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: line.product.images[0],
									alt: line.product.name,
									className: "h-14 w-14 shrink-0 rounded-2xl object-cover",
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-ink truncate text-sm font-semibold",
											children: line.product.name
										}),
										line.variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground truncate text-xs",
											children: line.variant
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground text-xs",
											children: [
												line.quantity,
												" × ",
												formatPrice(line.product.price)
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyStepper, { line })
							]
						}, `${line.productId}-${line.variant ?? ""}`))
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-ink text-canvas m-3 mt-0 rounded-[1.5rem] p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-canvas/60 text-xs tracking-[0.18em] uppercase",
							children: "I alt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "font-display text-2xl font-semibold",
							children: formatPrice(total)
						}, total)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/kurv",
						onClick: onNavigate,
						className: "bg-accent-mint text-accent-mint-foreground group mt-4 flex h-12 items-center justify-between rounded-full pr-1.5 pl-5 text-sm font-semibold transition-transform hover:scale-[1.02]",
						children: ["Se kurven", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-ink text-canvas grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:translate-x-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-canvas/50 mt-3 text-[11px] leading-relaxed",
						children: "Ingen online betaling — du får en bekræftelse og betaler via MobilePay."
					})
				]
			})
		]
	});
}
function QtyStepper({ line }) {
	const { setQuantity } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-ink/10 flex flex-col items-center rounded-full border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Flere",
			onClick: () => setQuantity(line.productId, line.quantity + 1, line.variant),
			className: "text-muted-foreground hover:text-ink grid h-6 w-7 place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Færre",
			onClick: () => setQuantity(line.productId, line.quantity - 1, line.variant),
			className: "text-muted-foreground hover:text-ink grid h-6 w-7 place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
		})]
	});
}
var nav = [
	{
		to: "/produkter",
		label: "Produkter",
		search: {
			kategori: "alle",
			q: ""
		}
	},
	{
		to: "/om",
		label: "Om TechBoks"
	},
	{
		to: "/kontakt",
		label: "Kontakt"
	}
];
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const { count } = useCart();
	const wrapRef = (0, import_react.useRef)(null);
	const { scrollYProgress } = useScroll();
	const progress = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 30,
		mass: .3
	});
	(0, import_react.useEffect)(() => {
		if (!cartOpen) return;
		const onDown = (e) => {
			if (wrapRef.current && !wrapRef.current.contains(e.target)) setCartOpen(false);
		};
		const onKey = (e) => e.key === "Escape" && setCartOpen(false);
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [cartOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "pointer-events-none sticky top-0 z-50 px-3 pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-surface pointer-events-auto relative mx-auto flex max-w-[92rem] items-center gap-4 rounded-full py-2.5 pr-2.5 pl-5 shadow-[0_16px_40px_-30px_oklch(0.2_0.02_250/0.9)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex",
					children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						..."search" in item ? { search: item.search } : {},
						className: "text-ink/70 hover:bg-canvas hover:text-ink rounded-full px-4 py-2 text-sm font-medium transition-colors",
						activeProps: { className: "text-ink bg-canvas" },
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: wrapRef,
					className: "ml-auto flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCartOpen((v) => !v),
							"aria-expanded": cartOpen,
							"aria-label": "Vis indkøbskurv",
							className: "bg-ink text-canvas flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-transform hover:scale-[1.03]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
								"Kurv",
								count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									initial: { scale: .5 },
									animate: { scale: 1 },
									className: "bg-accent-mint text-accent-mint-foreground grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold",
									children: count
								}, count)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: cartOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: -10,
								scale: .97
							},
							animate: {
								opacity: 1,
								y: 0,
								scale: 1
							},
							exit: {
								opacity: 0,
								y: -8,
								scale: .98
							},
							transition: {
								type: "spring",
								stiffness: 320,
								damping: 28
							},
							className: "absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartPanel, { onNavigate: () => setCartOpen(false) })
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen((v) => !v),
							"aria-label": open ? "Luk menu" : "Åbn menu",
							className: "bg-canvas text-ink grid h-11 w-11 shrink-0 place-items-center rounded-full md:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					style: { scaleX: progress },
					className: "bg-accent-mint absolute inset-x-5 bottom-0 h-[3px] origin-left rounded-full"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.nav, {
			initial: {
				opacity: 0,
				y: -8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				y: -8
			},
			className: "bg-surface rounded-blob pointer-events-auto mx-auto mt-2 max-w-[92rem] p-3 shadow-[0_20px_50px_-30px_oklch(0.2_0.02_250/0.9)] md:hidden",
			children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: item.to,
				..."search" in item ? { search: item.search } : {},
				onClick: () => setOpen(false),
				className: "text-ink font-display block rounded-2xl px-4 py-3 text-2xl font-semibold tracking-tight",
				children: item.label
			}, item.to))
		}) })]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "px-3 pb-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-blob-lg bg-ink text-canvas mt-6 p-7 sm:p-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-canvas inline-flex rounded-full px-4 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display mt-8 text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl",
								children: [
									"Dansk designet.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Printet i små serier."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-canvas/55 mt-5 max-w-sm text-sm leading-relaxed",
								children: "Produkter der løser konkrete hverdagsproblemer — tegnet fra bunden, målt op og printet i vores eget værksted."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-canvas/45 text-[11px] tracking-[0.2em] uppercase",
						children: "Kategorier"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-5 space-y-3 text-sm",
						children: [
							categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/produkter",
								search: {
									kategori: c.slug,
									q: ""
								},
								className: "link-underline text-canvas/80",
								children: c.name
							}) }, c.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/produkter",
								search: {
									kategori: "alle",
									q: ""
								},
								className: "link-underline text-canvas/80",
								children: "Alle produkter"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/om",
								className: "link-underline text-canvas/80",
								children: "Om TechBoks"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-canvas/45 text-[11px] tracking-[0.2em] uppercase",
						children: "Kontakt"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "text-canvas/80 mt-5 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/kontakt",
								className: "link-underline",
								children: "Kontakt & bestilling"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "info@techboks.dk" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Betaling via MobilePay" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fragt med GLS / PostNord" })
						]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-canvas/15 text-canvas/45 mt-12 flex flex-wrap items-center justify-between gap-2 border-t pt-6 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" TechBoks — printet i Danmark"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CVR · Handelsbetingelser · Privatlivspolitik" })]
			})]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "TechBoks — Dansk designet 3D print tilbehør" },
			{
				name: "description",
				content: "TechBoks designer og 3D printer funktionelt tilbehør i Danmark — til bil, hjem og dine egne projekter."
			},
			{
				name: "author",
				content: "TechBoks"
			},
			{
				property: "og:title",
				content: "TechBoks — Dansk designet 3D print tilbehør"
			},
			{
				property: "og:description",
				content: "Funktionelt 3D printet tilbehør, designet og produceret i Danmark."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "da",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-canvas flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		}) })
	});
}
var hero_mache_png_asset_default = {
	version: 1,
	asset_id: "52ea5243-93ec-4283-b998-db7bfd6e48a8",
	project_id: "6e4f19c3-a933-4963-8943-a4334f7e12b3",
	url: "/__l5e/assets-v1/52ea5243-93ec-4283-b998-db7bfd6e48a8/hero-mache.png",
	r2_key: "a/v1/6e4f19c3-a933-4963-8943-a4334f7e12b3/52ea5243-93ec-4283-b998-db7bfd6e48a8/hero-mache.png",
	original_filename: "hero-mache.png",
	size: 696831,
	content_type: "image/png",
	created_at: "2026-08-03T20:45:08Z"
};
/**
* Infinite ticker whose speed and direction react to scroll velocity.
*/
function Marquee({ items, baseSpeed = 40 }) {
	const row = [...items, ...items];
	const x = useMotionValue(0);
	const trackRef = (0, import_react.useRef)(null);
	const { scrollY } = useScroll();
	const velocity = useVelocity(scrollY);
	const smooth = useSpring(velocity, {
		damping: 50,
		stiffness: 400
	});
	const factor = useTransform(smooth, [
		-1500,
		0,
		1500
	], [
		-4,
		1,
		4
	], { clamp: false });
	useAnimationFrame((_, delta) => {
		const width = trackRef.current ? trackRef.current.scrollWidth / 2 : 1;
		const move = baseSpeed * (delta / 1e3) * factor.get() % width;
		let next = x.get() - move;
		if (next <= -width) next += width;
		if (next > 0) next -= width;
		x.set(next);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "group bg-ink text-canvas relative overflow-hidden rounded-full py-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			ref: trackRef,
			style: { x },
			className: "flex w-max gap-10",
			children: row.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-display flex shrink-0 items-center gap-10 text-lg font-medium tracking-tight whitespace-nowrap sm:text-xl",
				children: [item, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-accent-mint inline-block h-1.5 w-1.5 rounded-full",
					"aria-hidden": true
				})]
			}, `${item}-${i}`))
		})
	});
}
/** Scroll-triggered entrance used across the site. */
function Reveal({ children, delay = 0, y = 28, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: className ?? "",
		initial: {
			opacity: 0,
			y
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: {
			duration: .7,
			delay,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children
	});
}
/** Word-by-word opacity reveal driven by scroll position (Coda-style). */
function ScrollText({ text, className = "" }) {
	const ref = (0, import_react.useRef)(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 0.85", "end 0.45"]
	});
	const words = text.split(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		className: `flex flex-wrap ${className}`,
		children: words.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Word, {
			progress: scrollYProgress,
			range: [i / words.length, (i + 1) / words.length],
			children: word
		}, `${word}-${i}`))
	});
}
function Word({ children, progress, range }) {
	const opacity = useTransform(progress, range, [.15, 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "mr-[0.28em] inline-block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
			style: { opacity },
			className: "inline-block",
			children
		})
	});
}
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "TechBoks — Dansk designet 3D print tilbehør" },
		{
			name: "description",
			content: "TechBoks designer og 3D printer funktionelt tilbehør i Danmark. Gadgets til Mustang Mach-E og smarte løsninger til hjemmet."
		},
		{
			property: "og:title",
			content: "TechBoks — Dansk designet 3D print tilbehør"
		},
		{
			property: "og:description",
			content: "Funktionelt 3D printet tilbehør, designet og produceret i Danmark. Se produkterne."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: Home
});
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Manifesto, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackedCategories, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClosingCta, {})
		]
	});
}
function Hero() {
	const ref = (0, import_react.useRef)(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"]
	});
	const veil = useTransform(scrollYProgress, [0, .85], [0, 1]);
	const contentOpacity = useTransform(scrollYProgress, [0, .55], [1, 0]);
	const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "px-3 pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref,
			className: "bg-surface rounded-blob relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-[992/541]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hero_mache_png_asset_default.url,
					alt: "Sort Ford Mustang Mach-E i et værksted med 3D printere",
					className: "pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "from-surface via-surface/90 sm:via-surface/70 absolute inset-0 bg-gradient-to-r to-transparent to-85% sm:via-45%" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					style: { opacity: veil },
					className: "bg-canvas pointer-events-none absolute inset-0 z-20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					style: {
						opacity: contentOpacity,
						y: contentY
					},
					className: "relative flex h-full flex-col justify-start p-6 pt-10 sm:p-12 lg:p-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							initial: {
								opacity: 0,
								y: 14
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .7 },
							className: "text-muted-foreground text-xs tracking-[0.24em] uppercase",
							children: "Designet og printet i Danmark"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "display-xl text-ink mt-5 max-w-3xl",
							children: ["Tilbehør der er", "tegnet til at passe."].map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									className: "block pb-[0.09em]",
									initial: { y: "110%" },
									animate: { y: 0 },
									transition: {
										duration: .95,
										delay: .1 + i * .12,
										ease: [
											.22,
											1,
											.36,
											1
										]
									},
									children: line
								})
							}, line))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							initial: {
								opacity: 0,
								y: 16
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .8,
								delay: .4
							},
							className: "text-muted-foreground mt-6 max-w-md text-base leading-relaxed",
							children: "Små serier, præcise mål og funktion før pynt — tegnet fra bunden i vores eget værksted."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .8,
								delay: .5
							},
							className: "mt-7 flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/produkter",
								search: {
									kategori: "alle",
									q: ""
								},
								className: "bg-accent-mint text-accent-mint-foreground group flex h-14 items-center gap-4 rounded-full pr-2 pl-7 text-sm font-semibold text-nowrap transition-transform hover:scale-[1.03]",
								children: ["Se produkter", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-ink text-canvas grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#manifest",
								className: "border-ink/25 text-ink hover:bg-ink/5 grid h-14 w-14 place-items-center rounded-full border transition-colors",
								"aria-label": "Scroll ned",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									animate: { y: [
										0,
										5,
										0
									] },
									transition: {
										duration: 1.8,
										repeat: Infinity,
										ease: "easeInOut"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-5 w-5" })
								})
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, { items: [
				"0,2 mm laghøjde",
				"Printet i Danmark",
				"3–7 hverdages levering",
				"Betaling via MobilePay",
				`${products.length}+ produkter`,
				"PETG & PLA"
			] })
		})]
	});
}
function Manifesto() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "manifest",
		className: "container-tb scroll-mt-28 py-28 sm:py-40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground text-xs tracking-[0.24em] uppercase",
				children: "Sådan arbejder vi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, {
				className: "display-lg text-ink mt-8 max-w-5xl",
				text: "Vi tegner hvert produkt fra bunden, måler op i virkeligheden og printer i små serier — så det passer præcist, holder til hverdagen og ikke ligner noget andet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid gap-3 md:grid-cols-3",
				children: [
					[
						`${products.length}+`,
						"produkter i katalog",
						"bg-surface"
					],
					[
						"0,2 mm",
						"laghøjde på hvert print",
						"bg-clay"
					],
					[
						"3–7",
						"hverdage til din dør",
						"bg-accent-mint"
					]
				].map(([value, label, bg], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * .08,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						whileHover: { y: -8 },
						transition: {
							type: "spring",
							stiffness: 300,
							damping: 20
						},
						className: `rounded-blob ${bg} text-ink p-8`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-5xl font-semibold tracking-tight",
							children: value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm opacity-70",
							children: label
						})]
					})
				}, label))
			})
		]
	});
}
function StackedCategories() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "katalog",
		className: "container-tb scroll-mt-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "display-lg text-ink max-w-xl",
				children: [
					"To kategorier.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Én besættelse af detaljer."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/produkter",
				search: {
					kategori: "alle",
					q: ""
				},
				className: "text-ink link-underline text-sm font-medium tracking-wide",
				children: "Se alle produkter →"
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 flex flex-col gap-4",
			children: categories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MergeCard, {
				index: i,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produkter",
					search: {
						kategori: c.slug,
						q: ""
					},
					className: "rounded-blob-lg bg-surface group grid overflow-hidden lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-muted aspect-[16/11] overflow-hidden lg:aspect-auto lg:h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image,
							alt: c.name,
							loading: "lazy",
							className: "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between gap-8 p-8 sm:p-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px] tracking-[0.2em] uppercase",
								children: c.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed",
								children: c.description
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-ink text-canvas grid h-14 w-14 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })
						})]
					})]
				})
			}, c.id))
		})]
	});
}
/** Cards slide in from alternating sides and merge into place while scrolling. */
function MergeCard({ children, index }) {
	const ref = (0, import_react.useRef)(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "center center"]
	});
	const dir = index % 2 === 0 ? -1 : 1;
	const x = useTransform(scrollYProgress, [0, 1], [dir * 160, 0]);
	const rotate = useTransform(scrollYProgress, [0, 1], [dir * 4, 0]);
	const scale = useTransform(scrollYProgress, [0, 1], [.88, 1]);
	const opacity = useTransform(scrollYProgress, [0, .6], [0, 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			style: {
				x,
				rotate,
				scale,
				opacity
			},
			className: "will-change-transform",
			children
		})
	});
}
function ProductStrip() {
	const preview = products.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container-tb mt-32",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground text-xs tracking-[0.24em] uppercase",
			children: "Et udpluk"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "display-lg text-ink mt-4 max-w-xl",
			children: "Rul igennem kataloget"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5",
			children: [preview.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlyInCard, {
				index: i,
				className: "lg:col-span-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produkter/$slug",
					params: { slug: p.slug },
					className: "rounded-blob bg-surface group block h-full overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-muted aspect-[4/3] overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.images[0],
							alt: p.name,
							loading: "lazy",
							className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-ink truncate text-lg font-semibold tracking-tight",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mt-1 text-sm",
								children: formatPrice(p.price)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "border-ink/15 text-ink grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-transform group-hover:rotate-45",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })
						})]
					})]
				})
			}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlyInCard, {
				index: 4,
				className: "sm:col-span-2 lg:col-span-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produkter",
					search: {
						kategori: "alle",
						q: ""
					},
					className: "bg-accent-mint text-accent-mint-foreground rounded-blob flex h-full min-h-[12rem] flex-col items-start justify-between p-6 transition-transform hover:scale-[1.02]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-3xl font-semibold tracking-tight",
						children: [
							"Se alle",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"produkter"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "border-ink/15 text-ink grid h-10 w-10 place-items-center rounded-full border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
					})]
				})
			})]
		})]
	});
}
/** Cards fly in from the right with a lively spring motion. */
function FlyInCard({ children, index, className }) {
	const ref = (0, import_react.useRef)(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "center center"]
	});
	const x = useTransform(scrollYProgress, [0, 1], [240 + index * 60, 0]);
	const y = useTransform(scrollYProgress, [0, 1], [40 + index % 2 * 30, 0]);
	const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 8 : -6, 0]);
	const scale = useTransform(scrollYProgress, [0, 1], [.82, 1]);
	const opacity = useTransform(scrollYProgress, [0, .85], [0, 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			style: {
				x,
				y,
				rotate,
				scale,
				opacity
			},
			className: "h-full will-change-transform",
			children
		})
	});
}
function BenefitsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container-tb mt-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-blob-lg bg-ink text-canvas overflow-hidden p-10 sm:p-16 lg:p-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-canvas/50 text-xs tracking-[0.24em] uppercase",
						children: "Hvorfor TechBoks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-lg mt-6",
						children: "Håndværk, ikke masseproduktion"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-canvas/60 mt-4 text-base leading-relaxed",
						children: "Vi designer, måler og printer hver detalje selv — så du får reservedele og gadgets der holder."
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					{
						icon: ShieldCheck,
						title: "Holdbare materialer",
						text: "Vi printer i PETG og tekniske filamenter, der tåler varme, vibrationer og daglig brug.",
						bg: "bg-ink",
						textColor: "text-canvas",
						accent: "bg-accent-mint",
						accentIcon: "text-accent-mint-foreground",
						ring: "ring-canvas/10"
					},
					{
						icon: Leaf,
						title: "Grøn produktion",
						text: "Bionedbrydeligt plast og grøn strøm. Små serier betyder minimalt spild.",
						bg: "bg-accent-mint",
						textColor: "text-accent-mint-foreground",
						accent: "bg-ink",
						accentIcon: "text-canvas",
						ring: "ring-accent-mint-foreground/20"
					},
					{
						icon: Boxes,
						title: "Personlig service",
						text: "Farver, mål og detaljer kan tilpasses. Skriv til os — der sidder et menneske i den anden ende.",
						bg: "bg-clay",
						textColor: "text-ink",
						accent: "bg-ink",
						accentIcon: "text-canvas",
						ring: "ring-ink/10"
					}
				].map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FanCard, {
					index: i,
					className: i === 1 ? "sm:col-span-2 lg:col-span-1" : "",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						whileHover: { y: -10 },
						transition: {
							type: "spring",
							stiffness: 250,
							damping: 18
						},
						className: `${b.bg} ${b.textColor} rounded-blob-lg relative h-full min-h-[22rem] p-7 ring-1 ${b.ring} sm:p-8`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `${b.accent} ${b.accentIcon} grid h-12 w-12 place-items-center rounded-full`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, {
									className: "h-5 w-5",
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display mt-8 text-2xl font-semibold tracking-tight sm:text-3xl",
								children: b.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-4 text-sm leading-relaxed opacity-70`,
								children: b.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-6 right-6 h-2 w-2 rounded-full bg-current opacity-20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-10 bottom-10 h-16 w-16 rounded-full bg-current opacity-[0.03]" })
						]
					})
				}, b.title))
			})]
		})
	});
}
/** Cards fan in from a spread-out deck and align while scrolling. */
function FanCard({ children, index, className }) {
	const ref = (0, import_react.useRef)(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "center center"]
	});
	const offset = index - 1;
	const x = useTransform(scrollYProgress, [0, 1], [offset * -90, 0]);
	const y = useTransform(scrollYProgress, [0, 1], [80 + Math.abs(offset) * 40, 0]);
	const rotate = useTransform(scrollYProgress, [0, 1], [offset * 7, 0]);
	const scale = useTransform(scrollYProgress, [0, 1], [.85, 1]);
	const opacity = useTransform(scrollYProgress, [.05, .55], [0, 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			style: {
				x,
				y,
				rotate,
				scale,
				opacity
			},
			className: "h-full origin-bottom will-change-transform",
			children
		})
	});
}
function ClosingCta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container-tb mt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-blob-lg bg-accent-mint text-accent-mint-foreground flex flex-wrap items-center justify-between gap-6 p-10 sm:p-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-lg max-w-xl",
				children: "Klar til at rydde op i bilen?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/produkter",
				search: {
					kategori: "alle",
					q: ""
				},
				className: "bg-ink text-canvas group flex h-14 items-center gap-4 rounded-full pr-2 pl-7 text-sm font-semibold",
				children: ["Gå til kataloget", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-accent-mint text-accent-mint-foreground grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
				})]
			})]
		}) })
	});
}
var orderEndpoint = "https://script.google.com/macros/s/AKfycbwA4fHgmX_7sMUXh2ko3_Mxt5LNv2qwNdvqsS4OJCqJc2sOLJ7Mh8ggKNoRX4WD-aXq/exec";
function buildLegacyPayload(payload) {
	const address = [
		payload.customer.address,
		payload.customer.postalCode,
		payload.customer.city
	].filter(Boolean).join(", ");
	return {
		token: "TB-8472-SECURE-991",
		botField: "",
		customerName: payload.customer.name,
		customerEmail: payload.customer.email,
		customerPhone: payload.customer.phone,
		customerAddress: payload.customer.address,
		customerCityPostal: [payload.customer.postalCode, payload.customer.city].filter(Boolean).join(" "),
		customerNotes: payload.customer.notes,
		shippingMethod: "pickup",
		shippingCost: 0,
		items: payload.lines.map((line) => ({
			name: line.name,
			quantity: line.quantity,
			price: line.unitPrice,
			variant: line.variant ?? ""
		})),
		subtotal: payload.total,
		total: payload.total,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		_legacyAddress: address
	};
}
async function submitOrder(payload) {
	const response = await fetch(orderEndpoint, {
		method: "POST",
		headers: { "Content-Type": "text/plain;charset=utf-8" },
		body: JSON.stringify(buildLegacyPayload(payload))
	});
	const text = await response.text();
	let data = null;
	if (text) try {
		data = JSON.parse(text);
	} catch {}
	if (!response.ok || data?.success !== true) throw new Error(data?.error ?? "Kunne ikke sende ordren. Prøv igen senere.");
	return {
		ok: true,
		reference: data?.orderId ?? `TB-${Date.now().toString().slice(-6)}`
	};
}
var Route$6 = createFileRoute("/bestil")({
	head: () => ({ meta: [
		{ title: "Send ordreforespørgsel — TechBoks" },
		{
			name: "description",
			content: "Udfyld dine oplysninger og send din ordreforespørgsel til TechBoks. Vi bekræfter på mail, og betaling sker via MobilePay."
		},
		{
			property: "og:title",
			content: "Send ordreforespørgsel — TechBoks"
		},
		{
			property: "og:description",
			content: "Bestil dine 3D printede produkter — betaling via MobilePay efter bekræftelse."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: OrderPage
});
var empty = {
	name: "",
	email: "",
	phone: "",
	address: "",
	postalCode: "",
	city: "",
	notes: ""
};
function OrderPage() {
	const { lines, total, clear } = useCart();
	const [customer, setCustomer] = (0, import_react.useState)(empty);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const update = (key, value) => setCustomer((c) => ({
		...c,
		[key]: value
	}));
	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus("sending");
		setErrorMessage(null);
		try {
			await submitOrder({
				customer,
				lines: lines.map((l) => ({
					productId: l.productId,
					name: l.product.name,
					variant: l.variant,
					quantity: l.quantity,
					unitPrice: l.product.price
				})),
				total
			});
			clear();
			setStatus("done");
		} catch (error) {
			setStatus("idle");
			setErrorMessage(error instanceof Error ? error.message : "Kunne ikke sende ordren. Prøv igen senere.");
		}
	};
	if (status === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-tb pt-10 pb-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .96,
				y: 24
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			transition: {
				duration: .6,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: "rounded-blob-lg bg-ink text-canvas relative mx-auto max-w-2xl overflow-hidden p-10 text-center sm:p-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-accent-mint/25 pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { scale: 0 },
					animate: { scale: 1 },
					transition: {
						type: "spring",
						stiffness: 260,
						damping: 16,
						delay: .15
					},
					className: "bg-accent-mint text-accent-mint-foreground relative mx-auto grid h-16 w-16 place-items-center rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display relative mt-8 text-4xl leading-[1] font-semibold tracking-tight sm:text-5xl",
					children: "Tak for din forespørgsel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-canvas/60 relative mx-auto mt-5 max-w-md text-sm leading-relaxed",
					children: "Vi har modtaget din ordre og vender tilbage på mail med en bekræftelse samt et MobilePay-nummer til betaling."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produkter",
					search: {
						kategori: "alle",
						q: ""
					},
					className: "bg-accent-mint text-accent-mint-foreground group relative mt-9 inline-flex h-13 items-center gap-3 rounded-full py-3.5 pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.03]",
					children: ["Tilbage til produkterne", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-ink text-canvas grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:translate-x-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-tb pt-10 pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
			initial: {
				opacity: 0,
				y: 18
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .5,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: "rounded-blob-lg bg-ink text-canvas relative overflow-hidden p-8 sm:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-accent-mint/20 pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-canvas/50 text-xs tracking-[0.24em] uppercase",
					children: "Trin 2 af 2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl",
					children: "Ordreforespørgsel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-canvas/60 mt-5 max-w-lg text-sm leading-relaxed",
					children: "Der er ingen online betaling. Udfyld dine oplysninger, så bekræfter vi ordren på mail med pris inkl. fragt og et MobilePay-nummer."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
				initial: {
					opacity: 0,
					y: 24
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					delay: .08,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				onSubmit: handleSubmit,
				className: "rounded-blob-lg bg-surface p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground text-xs tracking-[0.24em] uppercase",
						children: "Dine oplysninger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Navn",
								required: true,
								value: customer.name,
								onChange: (v) => update("name", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "E-mail",
								type: "email",
								required: true,
								value: customer.email,
								onChange: (v) => update("email", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Telefon",
								type: "tel",
								required: true,
								value: customer.phone,
								onChange: (v) => update("phone", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Adresse",
								required: true,
								value: customer.address,
								onChange: (v) => update("address", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Postnummer",
								required: true,
								value: customer.postalCode,
								onChange: (v) => update("postalCode", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "By",
								required: true,
								value: customer.city,
								onChange: (v) => update("city", v)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-ink block text-sm font-medium",
							htmlFor: "notes",
							children: "Bemærkninger til ordren"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "notes",
							rows: 4,
							value: customer.notes,
							onChange: (e) => update("notes", e.target.value),
							placeholder: "Ønsker du en særlig farve, tekst eller tilpasning? Skriv det her.",
							className: "bg-canvas text-ink placeholder:text-muted-foreground focus:ring-ink/20 mt-2 w-full rounded-3xl border-0 px-5 py-4 text-sm outline-none focus:ring-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: lines.length === 0 || status === "sending",
						className: "bg-ink text-canvas group mt-8 flex h-14 w-full items-center justify-between rounded-full pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.01] disabled:scale-100 disabled:opacity-40",
						children: [status === "sending" ? "Sender…" : "Send ordreforespørgsel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-accent-mint text-accent-mint-foreground grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						})]
					}),
					errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-destructive mt-3 text-center text-sm",
						children: errorMessage
					}),
					lines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-3 text-center text-xs",
						children: "Din kurv er tom — tilføj produkter først."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
				initial: {
					opacity: 0,
					y: 24
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					delay: .16,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "rounded-blob-lg bg-surface sticky top-28 p-6 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground text-xs tracking-[0.24em] uppercase",
						children: "Din ordre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-6 space-y-3",
						children: [lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-canvas rounded-blob flex items-center gap-3 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: line.product.images[0],
									alt: line.product.name,
									loading: "lazy",
									className: "h-14 w-14 shrink-0 rounded-2xl object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-ink truncate text-sm font-semibold",
										children: line.product.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground truncate text-xs",
										children: [
											line.variant ? `${line.variant} · ` : "",
											line.quantity,
											" stk."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink shrink-0 text-sm font-semibold",
									children: formatPrice(line.lineTotal)
								})
							]
						}, `${line.productId}-${line.variant ?? ""}`)), lines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-ink/10 text-muted-foreground rounded-blob border border-dashed p-5 text-sm",
							children: "Ingen varer"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-ink text-canvas mt-5 rounded-[1.5rem] p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-canvas/60 text-xs tracking-[0.18em] uppercase",
								children: "I alt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl font-semibold",
								children: formatPrice(total)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-canvas/50 mt-3 text-[11px] leading-relaxed",
							children: "Fragt afregnes ved bekræftelsen. Betaling via MobilePay."
						})]
					})
				]
			})]
		})]
	});
}
function Field({ label, value, onChange, type = "text", required }) {
	const id = label.toLowerCase().replace(/[^a-z]/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: "text-ink block text-sm font-medium",
		children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: " *"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		type,
		required,
		value,
		onChange: (e) => onChange(e.target.value),
		className: "bg-canvas text-ink focus:ring-ink/20 mt-2 h-12 w-full rounded-full border-0 px-5 text-sm outline-none focus:ring-2"
	})] });
}
var Route$5 = createFileRoute("/kontakt")({
	head: () => ({ meta: [
		{ title: "Kontakt TechBoks — skriv, bestil eller hent i Aarhus N" },
		{
			name: "description",
			content: "Kontakt TechBoks om bestilling, specialønsker eller levering. Skriv via formularen, Messenger eller Instagram — svar inden for 24 timer."
		},
		{
			property: "og:title",
			content: "Kontakt TechBoks"
		},
		{
			property: "og:description",
			content: "Skriv til TechBoks om bestilling og specialønsker. Svar inden for 24 timer."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: ContactPage
});
var contactSchema = objectType({
	name: stringType().trim().min(1, "Skriv dit navn").max(100, "Navnet er for langt"),
	email: stringType().trim().email("Ugyldig email").max(255),
	phone: stringType().trim().max(40, "Telefonnummeret er for langt"),
	subject: stringType().trim().min(1, "Skriv et emne").max(150, "Emnet er for langt"),
	message: stringType().trim().min(1, "Skriv en besked").max(1e3, "Beskeden er for lang")
});
var channels = [{
	icon: MessageCircle,
	label: "Messenger",
	text: "Send en Messenger besked",
	href: "https://www.facebook.com/messages/t/eskehagen",
	cta: "Åbn Messenger"
}, {
	icon: Instagram,
	label: "Instagram",
	text: "Send en Instagram besked",
	href: "https://www.instagram.com/3design_by_eske",
	cta: "Åbn Instagram"
}];
function ContactPage() {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [sent, setSent] = (0, import_react.useState)(false);
	const set = (field) => (e) => {
		setValues((v) => ({
			...v,
			[field]: e.target.value
		}));
		setErrors((prev) => ({
			...prev,
			[field]: void 0
		}));
	};
	const onSubmit = (e) => {
		e.preventDefault();
		const parsed = contactSchema.safeParse(values);
		if (!parsed.success) {
			const next = {};
			for (const issue of parsed.error.issues) {
				const key = issue.path[0];
				if (!next[key]) next[key] = issue.message;
			}
			setErrors(next);
			return;
		}
		const d = parsed.data;
		const body = [
			`Navn: ${d.name}`,
			`Email: ${d.email}`,
			d.phone ? `Telefon: ${d.phone}` : "",
			"",
			d.message
		].filter(Boolean).join("\n");
		window.location.href = `mailto:info@techboks.dk?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
		setSent(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-blob-lg bg-ink text-canvas relative mt-3 overflow-hidden px-6 py-16 sm:px-12 sm:py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					"aria-hidden": true,
					initial: {
						scale: .6,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					transition: {
						duration: 1.2,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "bg-accent-mint/25 pointer-events-none absolute -top-40 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-canvas/50 text-[11px] tracking-[0.25em] uppercase",
							children: "Kontakt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
							initial: {
								opacity: 0,
								y: 24
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .8,
								ease: [
									.22,
									1,
									.36,
									1
								]
							},
							className: "font-display mt-5 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl",
							children: [
								"Lad os få dit",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"print på vej"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							initial: {
								opacity: 0,
								y: 18
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .8,
								delay: .15,
								ease: [
									.22,
									1,
									.36,
									1
								]
							},
							className: "text-canvas/60 mt-6 max-w-xl text-base leading-relaxed",
							children: "Ønsker du at købe nogle af mine produkter — eller har du et specialønske? Skriv en besked, så vender jeg tilbage inden for 24 timer."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto mt-3 grid max-w-[92rem] gap-3 md:grid-cols-3",
				children: [channels.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * .08,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: c.href,
						target: "_blank",
						rel: "noreferrer noopener",
						className: "rounded-blob bg-surface group flex h-full flex-col p-7 transition-transform hover:-translate-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-canvas text-ink grid h-12 w-12 place-items-center rounded-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-ink mt-6 text-2xl font-semibold tracking-tight",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mt-2 text-sm",
								children: c.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-ink mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
								children: [c.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
							})
						]
					})
				}, c.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: .16,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-blob bg-accent-mint text-accent-mint-foreground flex h-full flex-col p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-ink text-canvas grid h-12 w-12 place-items-center rounded-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display mt-6 text-2xl font-semibold tracking-tight",
								children: "Levering"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm opacity-80",
								children: "Ordre kan sendes med GLS / PostNord — eller afhentes i Aarhus N."
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto mt-3 grid max-w-[92rem] gap-3 lg:grid-cols-[1.3fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-blob-lg bg-surface p-7 sm:p-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl",
						children: "Send mig en besked"
					}), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "bg-canvas rounded-blob mt-8 flex items-start gap-4 p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-accent-mint text-accent-mint-foreground grid h-10 w-10 shrink-0 place-items-center rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-ink font-semibold",
							children: "Tak for din besked!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-1 text-sm leading-relaxed",
							children: "Dit mailprogram åbner med beskeden klar til afsendelse. Jeg vender tilbage hurtigst muligt — typisk inden for 24 timer."
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						noValidate: true,
						className: "mt-8 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Navn",
								value: values.name,
								onChange: set("name"),
								error: errors.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Email",
								type: "email",
								value: values.email,
								onChange: set("email"),
								error: errors.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Telefon (valgfrit)",
								type: "tel",
								value: values.phone,
								onChange: set("phone"),
								error: errors.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Emne",
								value: values.subject,
								onChange: set("subject"),
								error: errors.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Besked",
									textarea: true,
									value: values.message,
									onChange: set("message"),
									error: errors.message
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "bg-ink text-canvas inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03]",
									children: "Send besked"
								})
							})
						]
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: .1,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-blob-lg bg-ink text-canvas h-full p-7 sm:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
								children: "Bestilling"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-canvas/65 mt-6 space-y-4 text-sm leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "For bestilling kontakter du mig via formularen eller Messenger. Skriv hvilke produkter du ønsker at bestille, samt eventuelle specialønsker." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Det er muligt at få tilsendt bestillingen eller afhente den i Aarhus N. Betaling sker via MobilePay, når ordren er bekræftet." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Jeg bestræber mig på at besvare alle henvendelser inden for 24 timer." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://www.techboks.dk/handelsbetingelser.html",
								target: "_blank",
								rel: "noreferrer noopener",
								className: "bg-canvas text-ink mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.03]",
								children: ["Se handelsbetingelser", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
							})
						]
					})
				})]
			})
		]
	});
}
function TextField({ label, value, onChange, error, type = "text", textarea = false }) {
	const base = "bg-canvas text-ink placeholder:text-muted-foreground/60 w-full rounded-2xl px-5 py-3.5 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_2px_var(--color-ink)]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground mb-2 block text-[11px] tracking-[0.18em] uppercase",
				children: label
			}),
			textarea ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				rows: 6,
				value,
				onChange,
				className: base
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type,
				value,
				onChange,
				className: base
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive mt-2 block text-xs font-medium",
				children: error
			})
		]
	});
}
var Route$4 = createFileRoute("/kurv")({
	head: () => ({ meta: [
		{ title: "Din kurv — TechBoks" },
		{
			name: "description",
			content: "Se din kurv hos TechBoks, justér antal og gå videre til ordreforespørgsel. Betaling foregår nemt via MobilePay bagefter."
		},
		{
			property: "og:title",
			content: "Din kurv — TechBoks"
		},
		{
			property: "og:description",
			content: "Gennemgå din kurv og send din ordreforespørgsel."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: CartPage
});
function CartPage() {
	const { lines, count, total, setQuantity, remove } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-tb pt-10 pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
			initial: {
				opacity: 0,
				y: 18
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .5,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: "rounded-blob-lg bg-ink text-canvas relative overflow-hidden p-8 sm:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-accent-mint/20 pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-canvas/50 text-xs tracking-[0.24em] uppercase",
					children: "Trin 1 af 2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl",
					children: "Din kurv"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-canvas/60 mt-5 max-w-md text-sm leading-relaxed",
					children: count === 0 ? "Ingen varer endnu — find noget der løser et problem i hverdagen." : `${count} ${count === 1 ? "vare" : "varer"} klar til din ordreforespørgsel. Ingen online betaling.`
				})
			]
		}), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				delay: .1,
				duration: .5
			},
			className: "rounded-blob-lg border-ink/15 bg-surface mt-6 border border-dashed p-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-accent-mint text-accent-mint-foreground mx-auto grid h-14 w-14 place-items-center rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-ink mt-6 text-2xl font-semibold",
					children: "Kurven er tom"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-2 text-sm",
					children: "Klik dig ind på et produkt, vælg farve og antal."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/produkter",
					search: {
						kategori: "alle",
						q: ""
					},
					className: "bg-ink text-canvas mt-8 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03]",
					children: "Se produkter"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					children: lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
						layout: true,
						initial: {
							opacity: 0,
							y: 24
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							x: 40,
							scale: .96
						},
						transition: {
							duration: .45,
							delay: Math.min(i, 5) * .05,
							ease: [
								.22,
								1,
								.36,
								1
							]
						},
						className: "rounded-blob bg-surface group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 p-4 transition-shadow hover:shadow-xl sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: line.product.images[0],
								alt: line.product.name,
								loading: "lazy",
								className: "h-20 w-20 shrink-0 rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:h-28 sm:w-28"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/produkter/$slug",
										params: { slug: line.product.slug },
										className: "font-display text-ink text-lg font-semibold tracking-tight hover:underline",
										children: line.product.name
									}),
									line.variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-canvas text-muted-foreground mt-2 inline-block rounded-full px-3 py-1 text-xs",
										children: line.variant
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground mt-1 text-sm",
										children: [formatPrice(line.product.price), " pr. stk."]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-3 sm:hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityControl, {
											line,
											setQuantity
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemoveButton, {
											line,
											remove
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-4 sm:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityControl, {
										line,
										setQuantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
										initial: {
											opacity: 0,
											y: 6
										},
										animate: {
											opacity: 1,
											y: 0
										},
										className: "font-display text-ink w-28 text-right text-lg font-semibold",
										children: formatPrice(line.lineTotal)
									}, line.lineTotal),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemoveButton, {
										line,
										remove
									})
								]
							})
						]
					}, `${line.productId}-${line.variant ?? ""}`))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
				layout: true,
				initial: {
					opacity: 0,
					y: 24
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "rounded-blob-lg bg-ink text-canvas sticky top-28 overflow-hidden p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-canvas/50 text-xs tracking-[0.24em] uppercase",
						children: "Opsummering"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-canvas/60",
								children: "Varer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: formatPrice(total)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-canvas/60",
								children: "Fragt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-canvas/60",
								children: "Beregnes ved bekræftelse"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-canvas/15 mt-6 flex items-baseline justify-between border-t pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "I alt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "font-display text-3xl font-semibold",
							children: formatPrice(total)
						}, total)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/bestil",
						className: "bg-accent-mint text-accent-mint-foreground group mt-7 flex h-14 items-center justify-between rounded-full pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.02]",
						children: ["Gå til ordreforespørgsel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-ink text-canvas grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/produkter",
						search: {
							kategori: "alle",
							q: ""
						},
						className: "border-canvas/20 text-canvas hover:bg-canvas/10 mt-3 flex h-12 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
						children: "Fortsæt med at handle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-canvas/50 mt-5 text-[11px] leading-relaxed",
						children: "Du betaler ikke online. Vi bekræfter din ordre på mail, og betalingen sker via MobilePay."
					})
				]
			})]
		})]
	});
}
function QuantityControl({ line, setQuantity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-canvas flex h-11 shrink-0 items-center rounded-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Færre",
				onClick: () => setQuantity(line.productId, line.quantity - 1, line.variant),
				className: "text-muted-foreground hover:text-ink grid h-11 w-10 place-items-center rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				initial: {
					scale: .7,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				transition: {
					type: "spring",
					stiffness: 380,
					damping: 18
				},
				className: "text-ink w-7 text-center text-sm font-semibold",
				children: line.quantity
			}, line.quantity),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Flere",
				onClick: () => setQuantity(line.productId, line.quantity + 1, line.variant),
				className: "text-muted-foreground hover:text-ink grid h-11 w-10 place-items-center rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
function RemoveButton({ line, remove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Fjern fra kurv",
		onClick: () => remove(line.productId, line.variant),
		className: "text-muted-foreground hover:bg-ink hover:text-canvas grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
	});
}
var hero_workshop_default = "/assets/hero-workshop-Da0LK-Kw.jpg";
var Route$3 = createFileRoute("/om")({
	head: () => ({ meta: [
		{ title: "Om TechBoks — dansk 3D print værksted" },
		{
			name: "description",
			content: "TechBoks er et dansk 3D print værksted, hvor hvert produkt tegnes fra bunden med fokus på funktion, holdbarhed og æstetik."
		},
		{
			property: "og:title",
			content: "Om TechBoks — dansk 3D print værksted"
		},
		{
			property: "og:description",
			content: "Passion for design og teknologi — funktionelle produkter printet i Danmark."
		}
	] }),
	component: AboutPage
});
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-tb py-16 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "Om TechBoks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-4xl font-semibold text-ink sm:text-5xl",
						children: "Ét print ad gangen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-4 text-base leading-relaxed text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Hos TechBoks kombineres passion for design og innovation med funktionelle 3D printede produkter. Vi laver ting, der ikke bare ser godt ud, men også løser konkrete udfordringer i hverdagen." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Hvert produkt tegnes fra bunden med fokus på funktionalitet, holdbarhed og æstetik — fra specialdesignede bilgadgets til smarte løsninger i hjemmet. Alt produceres i små serier på egne printere med bæredygtige materialer og grøn strøm." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Visionen er enkel: at gøre gennemtænkte, funktionelle produkter tilgængelige for alle — og gøre din hverdag en anelse nemmere." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/produkter",
						search: {
							kategori: "alle",
							q: ""
						},
						className: "mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-primary-foreground",
						children: "Se produkterne"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hero_workshop_default,
					alt: "TechBoks værksted med 3D printer i gang",
					loading: "lazy",
					width: 1600,
					height: 1200,
					className: "h-full w-full object-cover"
				})
			})]
		})
	});
}
var BASE_URL = "https://precision-prints-dk.lovable.app";
var Route$2 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/produkter",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/om",
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/kontakt",
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/kurv",
				changefreq: "monthly",
				priority: "0.5"
			},
			{
				path: "/bestil",
				changefreq: "monthly",
				priority: "0.5"
			},
			...products.map((p) => ({
				path: `/produkter/${p.slug}`,
				changefreq: "weekly",
				priority: "0.8"
			}))
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
function CategoryFilter({ active, onChange, counts, total }) {
	const options = [{
		slug: "alle",
		name: "Alle produkter",
		count: total
	}].concat(categories.map((c) => ({
		slug: c.slug,
		name: c.name,
		count: counts[c.slug] ?? 0
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: options.map((o) => {
			const isActive = active === o.slug;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChange(o.slug),
				className: `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive ? "border-ink bg-ink text-primary-foreground" : "border-border bg-surface text-muted-foreground hover:border-ink/30 hover:text-ink"}`,
				children: [o.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: isActive ? "text-primary-foreground/60" : "text-muted-foreground/70",
					children: o.count
				})]
			}, o.slug);
		})
	});
}
function ProductCard({ product, index = 0, compact = false }) {
	const category = getCategory(product.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: "group relative h-full",
		"data-index": index,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/produkter/$slug",
			params: { slug: product.slug },
			className: "bg-surface rounded-blob-lg relative block h-full overflow-hidden transition-transform duration-500 group-hover:-translate-y-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `bg-muted relative overflow-hidden ${compact ? "aspect-square sm:aspect-[4/5]" : "aspect-[4/5]"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.images[0],
						alt: product.name,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `bg-canvas/90 text-ink absolute top-3 left-3 rounded-full font-semibold tracking-[0.14em] uppercase backdrop-blur sm:top-4 sm:left-4 ${compact ? "px-2 py-1 text-[9px] sm:text-[11px]" : "px-3 py-1.5 text-[11px]"}`,
						children: category?.name
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-ink text-canvas absolute right-4 bottom-4 grid h-11 w-11 translate-y-3 place-items-center rounded-full opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-5 w-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: compact ? "p-3 sm:flex sm:items-start sm:justify-between sm:gap-4 sm:p-5" : "flex items-start justify-between gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: `text-ink font-display truncate font-semibold tracking-tight ${compact ? "text-sm sm:text-lg" : "text-lg"}`,
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-muted-foreground mt-1 line-clamp-2 leading-relaxed ${compact ? "hidden text-sm sm:block" : "text-sm"}`,
						children: product.shortDescription
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `font-display text-ink shrink-0 font-semibold ${compact ? "mt-1 block text-sm sm:mt-0 sm:text-lg" : "text-lg"}`,
					children: formatPrice(product.price)
				})]
			})]
		})
	});
}
function ProductGrid({ products, compact = false }) {
	if (products.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-blob border-ink/15 bg-surface border border-dashed p-14 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-ink text-xl font-semibold",
			children: "Ingen produkter fundet"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground mt-2 text-sm",
			children: "Prøv en anden søgning eller vælg en anden kategori."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: compact ? "grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: products.map((product, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			layout: true,
			initial: {
				opacity: 0,
				y: 16
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .45,
				delay: Math.min(i, 5) * .05,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
				product,
				index: i,
				compact
			})
		}, product.id))
	});
}
var Route$1 = createFileRoute("/produkter/")({
	validateSearch: (search) => ({
		kategori: typeof search["kategori"] === "string" ? search["kategori"] : "alle",
		q: typeof search["q"] === "string" ? search["q"] : ""
	}),
	head: () => ({ meta: [
		{ title: "Alle produkter — TechBoks 3D print" },
		{
			name: "description",
			content: "Browse alle TechBoks produkter: 3D printet tilbehør til Mustang Mach-E og smarte løsninger til hjemmet. Filtrér efter kategori og søg."
		},
		{
			property: "og:title",
			content: "Alle produkter — TechBoks 3D print"
		},
		{
			property: "og:description",
			content: "3D printet tilbehør til bil og hjem. Filtrér, søg og find det du mangler."
		}
	] }),
	component: Catalogue
});
function Catalogue() {
	const { kategori, q } = Route$1.useSearch();
	const navigate = Route$1.useNavigate();
	const [atTop, setAtTop] = (0, import_react.useState)(true);
	const [compact, setCompact] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem("tb-catalogue-view") === "grid") setCompact(true);
	}, []);
	const setView = (value) => {
		setCompact(value);
		localStorage.setItem("tb-catalogue-view", value ? "grid" : "single");
	};
	(0, import_react.useEffect)(() => {
		const onScroll = () => setAtTop(window.scrollY < 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const counts = categories.reduce((acc, c) => {
		acc[c.slug] = products.filter((p) => p.category === c.id).length;
		return acc;
	}, {});
	const query = q.trim().toLowerCase();
	const filtered = products.filter((p) => {
		const matchesCategory = kategori === "alle" || p.category === kategori;
		const matchesQuery = query === "" || p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
		return matchesCategory && matchesQuery;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-tb pt-10 pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground text-xs tracking-[0.24em] uppercase",
					children: "Katalog"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl",
					children: "Alle produkter"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full items-center justify-between gap-4 sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground text-sm",
						children: [
							"Viser ",
							filtered.length,
							" af ",
							products.length,
							" produkter"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "group",
						"aria-label": "Vælg visning",
						className: "bg-surface flex items-center gap-1 rounded-full p-1 sm:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setView(false),
							"aria-pressed": !compact,
							"aria-label": "Vis ét stort kort ad gangen",
							className: `grid h-9 w-9 place-items-center rounded-full transition-colors ${compact ? "text-muted-foreground" : "bg-ink text-canvas"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows3, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setView(true),
							"aria-pressed": compact,
							"aria-label": "Vis produkter i gitterform",
							className: `grid h-9 w-9 place-items-center rounded-full transition-colors ${compact ? "bg-ink text-canvas" : "text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				animate: atTop ? {
					opacity: 1,
					y: 0
				} : {
					opacity: 0,
					y: -12
				},
				transition: {
					duration: .3,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				style: { pointerEvents: atTop ? "auto" : "none" },
				className: "-mx-3 mt-8 px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface rounded-blob flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryFilter, {
						active: kategori,
						counts,
						total: products.length,
						onChange: (slug) => navigate({
							to: ".",
							search: {
								kategori: slug,
								q
							}
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full lg:max-w-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: q,
								onChange: (e) => navigate({
									to: ".",
									search: {
										kategori,
										q: e.target.value
									}
								}),
								placeholder: "Søg i produkter…",
								"aria-label": "Søg i produkter",
								className: "border-border bg-canvas text-ink placeholder:text-muted-foreground focus:border-ink/30 focus:ring-ring/40 h-11 w-full rounded-full border pr-10 pl-11 text-sm outline-none focus:ring-2"
							}),
							q !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => navigate({
									to: ".",
									search: {
										kategori,
										q: ""
									}
								}),
								"aria-label": "Ryd søgning",
								className: "text-muted-foreground hover:text-ink absolute top-1/2 right-3 -translate-y-1/2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
					products: filtered,
					compact
				})
			})
		]
	});
}
var Route = createFileRoute("/produkter/$slug")({
	loader: ({ params }) => {
		const product = products.find((p) => p.slug === params.slug);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Produkt ikke fundet — TechBoks" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { product } = loaderData;
		const title = `${product.name} — TechBoks`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: product.shortDescription
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: product.shortDescription
			},
			{
				property: "og:image",
				content: product.images[0]
			},
			{
				name: "twitter:image",
				content: product.images[0]
			}
		] };
	},
	component: ProductDetailRoute,
	errorComponent: ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-tb py-24",
		role: "alert",
		children: error.message
	}),
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-tb py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold text-ink",
			children: "Produktet findes ikke"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/produkter",
			search: {
				kategori: "alle",
				q: ""
			},
			className: "mt-4 inline-block text-sm underline",
			children: "Se alle produkter"
		})]
	})
});
function ProductDetailRoute() {
	const { product } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetail, { product });
}
function ProductDetail({ product }) {
	const category = getCategory(product.category);
	const related = getRelatedProducts(product);
	const { add } = useCart();
	const [activeImage, setActiveImage] = (0, import_react.useState)(0);
	const [variant, setVariant] = (0, import_react.useState)(product.options?.[0]?.values[0]);
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [added, setAdded] = (0, import_react.useState)(false);
	const handleAdd = () => {
		add(product.id, quantity, variant);
		setAdded(true);
		window.setTimeout(() => setAdded(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-tb py-10 lg:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/produkter",
				search: {
					kategori: "alle",
					q: ""
				},
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Alle produkter"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-blob-lg bg-muted overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.images[activeImage],
						alt: product.name,
						className: "aspect-[4/3] h-full w-full object-cover"
					})
				}), product.images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-3",
					children: product.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveImage(i),
						"aria-label": `Vis billede ${i + 1}`,
						className: `h-20 w-20 overflow-hidden rounded-2xl transition-all ${i === activeImage ? "ring-ink ring-2" : "opacity-70 hover:opacity-100"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							loading: "lazy",
							className: "h-full w-full object-cover"
						})
					}, src))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface rounded-blob-lg p-7 sm:p-9",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow",
							children: category?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "display-lg text-ink mt-3",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-ink mt-4 text-2xl font-semibold",
							children: formatPrice(product.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-6 text-base leading-relaxed",
							children: product.description
						}),
						product.options?.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "eyebrow",
								children: option.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: option.values.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVariant(value),
									className: `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${variant === value ? "border-ink bg-ink text-primary-foreground" : "border-border bg-surface text-muted-foreground hover:border-ink/30 hover:text-ink"}`,
									children: value
								}, value))
							})]
						}, option.label)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-12 items-center rounded-full border border-border bg-surface",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuantity((q) => Math.max(1, q - 1)),
										"aria-label": "Færre",
										className: "grid h-12 w-11 place-items-center text-muted-foreground hover:text-ink",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 text-center text-sm font-semibold text-ink",
										children: quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuantity((q) => q + 1),
										"aria-label": "Flere",
										className: "grid h-12 w-11 place-items-center text-muted-foreground hover:text-ink",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleAdd,
								className: "inline-flex h-12 flex-1 min-w-48 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
								children: added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Lagt i kurven"] }) : "Læg i kurv"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-blob bg-canvas mt-10 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "eyebrow border-ink/10 border-b px-5 py-3.5",
								children: "Specifikationer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "divide-ink/10 divide-y",
								children: product.specifications.map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground text-sm",
										children: spec.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-ink text-sm font-medium",
										children: spec.value
									})]
								}, spec.label))
							})]
						})
					]
				})]
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-lg text-ink",
					children: "Relaterede produkter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			})
		]
	});
}
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$8
});
var BestilRoute = Route$6.update({
	id: "/bestil",
	path: "/bestil",
	getParentRoute: () => Route$8
});
var KontaktRoute = Route$5.update({
	id: "/kontakt",
	path: "/kontakt",
	getParentRoute: () => Route$8
});
var KurvRoute = Route$4.update({
	id: "/kurv",
	path: "/kurv",
	getParentRoute: () => Route$8
});
var OmRoute = Route$3.update({
	id: "/om",
	path: "/om",
	getParentRoute: () => Route$8
});
var SitemapDotxmlRoute = Route$2.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$8
});
var ProdukterIndexRoute = Route$1.update({
	id: "/produkter/",
	path: "/produkter/",
	getParentRoute: () => Route$8
});
var rootRouteChildren = {
	IndexRoute,
	BestilRoute,
	KontaktRoute,
	KurvRoute,
	OmRoute,
	SitemapDotxmlRoute,
	ProdukterSlugRoute: Route.update({
		id: "/produkter/$slug",
		path: "/produkter/$slug",
		getParentRoute: () => Route$8
	}),
	ProdukterIndexRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

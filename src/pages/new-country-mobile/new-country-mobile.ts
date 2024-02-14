import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NewCountryMobilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-new-country-mobile',
  templateUrl: 'new-country-mobile.html',
})
export class NewCountryMobilePage {

	countryList = [{'name': 'Ethiopia', 'code': '+251', 'flag':'et.png'}, {'name': 'South Africa', 'code': '+27', 'flag':'za.png'}, {'name': 'Zambia', 'code': '+260', 'flag':'zm.png'}, {'name': 'Afghanistan', 'code': '+93', 'flag':'af.png'}, {'name': 'Albania', 'code': '+355', 'flag':'al.png'}, {'name': 'Algeria', 'code': '+213', 'flag':'dz.png'}, {'name': 'American Samoa', 'code': '+1', 'flag':'as.png'}, {'name': 'Andorra', 'code': '+376', 'flag':'ad.png'}, {'name': 'Angola', 'code': '+244', 'flag':'ao.png'}, {'name': 'Anguilla', 'code': '+1', 'flag':'ai.png'}, {'name': 'Antigua and Barbuda', 'code': '+1', 'flag':'ag.png'}, {'name': 'Argentina', 'code': '+54', 'flag':'ar.png'}, {'name': 'Armenia', 'code': '+374', 'flag':'am.png'}, {'name': 'Aruba', 'code': '+297', 'flag':'aw.png'}, {'name': 'Australia', 'code': '+61', 'flag':'at.png'}, {'name': 'Austria', 'code': '+43', 'flag':'au.png'}, {'name': 'Azerbaijan', 'code': '+994', 'flag':'az.png'}, {'name': 'Bahamas', 'code': '+1', 'flag':'bs.png'}, {'name': 'Bahrain', 'code': '+973', 'flag':'bh.png'}, {'name': 'Bangladesh', 'code': '+880', 'flag':'bd.png'}, {'name': 'Barbados', 'code': '+1', 'flag':'bb.png'}, {'name': 'Belarus', 'code': '+375', 'flag':'by.png'}, {'name': 'Belgium', 'code': '+32', 'flag':'be.png'}, {'name': 'Belize', 'code': '+501', 'flag':'bz.png'}, {'name': 'Benin', 'code': '+229', 'flag':'bj.png'}, {'name': 'Bermuda', 'code': '+1', 'flag':'bm.png'}, {'name': 'Bhutan', 'code': '+975', 'flag':'bt.png'}, {'name': 'Bolivia', 'code': '+591', 'flag':'bo.png'}, {'name': 'Bosnia and Herzegovina', 'code': '+387', 'flag':'ba.png'}, {'name': 'Botswana', 'code': '+267', 'flag':'bw.png'}, {'name': 'Brazil', 'code': '+55', 'flag':'br.png'}, {'name': 'Brunei Darussalam', 'code': '+673', 'flag':'bn.png'}, {'name': 'Bulgaria', 'code': '+359', 'flag':'bg.png'}, {'name': 'Burkina Faso', 'code': '+226', 'flag':'bf.png'}, {'name': 'Burundi', 'code': '+257', 'flag':'bi.png'}, {'name': 'Cambodia', 'code': '+855', 'flag':'kh.png'}, {'name': 'Cameroon', 'code': '+237', 'flag':'cm.png'}, {'name': 'Canada', 'code': '+1', 'flag':'ca.png'}, {'name': 'Cayman Islands', 'code': '+1', 'flag':'ky.png'}, {'name': 'Central African Republic', 'code': '+236', 'flag':'cf.png'}, {'name': 'Chad', 'code': '+235', 'flag':'td.png'}, {'name': 'Chile', 'code': '+56', 'flag':'cl.png'}, {'name': 'China', 'code': '+86', 'flag':'cn.png'}, {'name': 'Christmas Island', 'code': '+61', 'flag':'cx.png'}, {'name': 'Cocos (Keeling) Islands', 'code': '+61', 'flag':'cc.png'}, {'name': 'Colombia', 'code': '+57', 'flag':'co.png'}, {'name': 'Comoros', 'code': '+269', 'flag':'km.png'}, {'name': 'Congo (Brazzaville)', 'code': '+242', 'flag':'cg.png'}, {'name': 'Congo (Kinshasa)', 'code': '+243', 'flag':'cd.png'}, {'name': 'Cook Islands', 'code': '+682', 'flag':'ck.png'}, {'name': 'Costa Rica', 'code': '+506', 'flag':'cr.png'}, {'name': 'Cote D-Ivoire (Ivory Coast)', 'code': '+225', 'flag':'ci.png'}, {'name': 'Croatia (Hrvatska)', 'code': '+385', 'flag':'hr.png'}, {'name': 'Cuba', 'code': '+53', 'flag':'cu.png'}, {'name': 'Cyprus', 'code': '+357', 'flag':'cy.png'}, {'name': 'Czech Republic', 'code': '+420', 'flag':'cz.png'}, {'name': 'Denmark', 'code': '+45', 'flag':'dk.png'}, {'name': 'Djibouti', 'code': '+253', 'flag':'dj.png'}, {'name': 'Dominica', 'code': '+1', 'flag':'dm.png'}, {'name': 'Dominican Republic', 'code': '+1', 'flag':'do.png'}, {'name': 'Ecuador', 'code': '+593', 'flag':'ec.png'}, {'name': 'Egypt', 'code': '+20', 'flag':'eg.png'}, {'name': 'El Salvador', 'code': '+503', 'flag':'sv.png'}, {'name': 'Equatorial Guinea', 'code': '+240', 'flag':'gq.png'}, {'name': 'Eritrea', 'code': '+291', 'flag':'er.png'}, {'name': 'Estonia', 'code': '+372', 'flag':'ee.png'}, {'name': 'Falkland Islands (Malvinas)', 'code': '+500', 'flag':'fk.png'}, {'name': 'Faroe Islands', 'code': '+298', 'flag':'fo.png'}, {'name': 'Fiji', 'code': '+679', 'flag':'fj.png'}, {'name': 'Finland', 'code': '+358', 'flag':'fi.png'}, {'name': 'France', 'code': '+33', 'flag':'fr.png'}, {'name': 'French Guiana', 'code': '+594', 'flag':'gf.png'}, {'name': 'French Polynesia', 'code': '+689', 'flag':'pf.png'}, {'name': 'Gabon', 'code': '+241', 'flag':'ga.png'}, {'name': 'Gambia', 'code': '+220', 'flag':'gm.png'}, {'name': 'Georgia', 'code': '+995', 'flag':'ge.png'}, {'name': 'Germany', 'code': '+49', 'flag':'de.png'}, {'name': 'Ghana', 'code': '+233', 'flag':'gh.png'}, {'name': 'Gibraltar', 'code': '+350', 'flag':'gi.png'}, {'name': 'Greece', 'code': '+30', 'flag':'gr.png'}, {'name': 'Greenland', 'code': '+299', 'flag':'gl.png'}, {'name': 'Grenada', 'code': '+1', 'flag':'gd.png'}, {'name': 'Guadeloupe', 'code': '+590', 'flag':'gp.png'}, {'name': 'Guam', 'code': '+1', 'flag':'gu.png'}, {'name': 'Guatemala', 'code': '+502', 'flag':'gt.png'}, {'name': 'Guinea', 'code': '+224', 'flag':'gn.png'}, {'name': 'Guinea-Bissau', 'code': '+245', 'flag':'gw.png'}, {'name': 'Guyana', 'code': '+592', 'flag':'gy.png'}, {'name': 'Haiti', 'code': '+509', 'flag':'ht.png'}, {'name': 'Holy See (Vatican City State)', 'code': '+379', 'flag':'va.png'}, {'name': 'Honduras', 'code': '+504', 'flag':'hn.png'}, {'name': 'Hong Kong, SAR', 'code': '+852', 'flag':'hk.png'}, {'name': 'Hungary', 'code': '+36', 'flag':'hu.png'}, {'name': 'Iceland', 'code': '+354', 'flag':'is.png'}, {'name': 'India', 'code': '+91', 'flag':'in.png'}, {'name': 'Indonesia', 'code': '+62', 'flag':'id.png'}, {'name': 'Iran, Islamic Republic of', 'code': '+98', 'flag':'ir.png'}, {'name': 'Iraq', 'code': '+964', 'flag':'iq.png'}, {'name': 'Ireland', 'code': '+353', 'flag':'ie.png'}, {'name': 'Israel', 'code': '+972', 'flag':'il.png'}, {'name': 'Italy', 'code': '+39', 'flag':'it.png'}, {'name': 'Jamaica', 'code': '+1', 'flag':'jm.png'}, {'name': 'Japan', 'code': '+81', 'flag':'jp.png'}, {'name': 'Jordan', 'code': '+962', 'flag':'jo.png'}, {'name': 'Kazakhstan', 'code': '+7', 'flag':'kz.png'}, {'name': 'Kenya', 'code': '+254', 'flag':'ke.png'}, {'name': 'Kiribati', 'code': '+686', 'flag':'ki.png'}, {'name': 'Korea, Democratic Peoples Republic of (North)', 'code': '+850', 'flag':'kp.png'}, {'name': 'Korea, Republic of (South)', 'code': '+82', 'flag':'kr.png'}, {'name': 'Kuwait', 'code': '+965', 'flag':'kw.png'}, {'name': 'Kyrgyzstan', 'code': '+996', 'flag':'kg.png'}, {'name': 'Laos (Lao PDR)', 'code': '+856', 'flag':'la.png'}, {'name': 'Latvia', 'code': '+371', 'flag':'lv.png'}, {'name': 'Lebanon', 'code': '+961', 'flag':'lb.png'}, {'name': 'Lesotho', 'code': '+266', 'flag':'ls.png'}, {'name': 'Liberia', 'code': '+231', 'flag':'lr.png'}, {'name': 'Libya', 'code': '+218', 'flag':'ly.png'}, {'name': 'Liechtenstein', 'code': '+423', 'flag':'li.png'}, {'name': 'Lithuania', 'code': '+370', 'flag':'lt.png'}, {'name': 'Luxembourg', 'code': '+352', 'flag':'lu.png'}, {'name': 'Macao (SAR China)', 'code': '+853', 'flag':'mo.png'}, {'name': 'Madagascar', 'code': '+261', 'flag':'mg.png'}, {'name': 'Malawi', 'code': '+265', 'flag':'mw.png'}, {'name': 'Malaysia', 'code': '+60', 'flag':'my.png'}, {'name': 'Maldives', 'code': '+960', 'flag':'mv.png'}, {'name': 'Mali', 'code': '+223', 'flag':'ml.png'}, {'name': 'Malta', 'code': '+356', 'flag':'mt.png'}, {'name': 'Marshall Islands', 'code': '+692', 'flag':'mh.png'}, {'name': 'Martinique', 'code': '+596', 'flag':'mq.png'}, {'name': 'Mauritania', 'code': '+222', 'flag':'mr.png'}, {'name': 'Mauritius', 'code': '+230', 'flag':'mu.png'}, {'name': 'Mayotte', 'code': '+262', 'flag':'yt.png'}, {'name': 'Mexico', 'code': '+52', 'flag':'mx.png'}, {'name': 'Micronesia, Federated States of', 'code': '+691', 'flag':'fm.png'}, {'name': 'Moldova', 'code': '+373', 'flag':'md.png'}, {'name': 'Monaco', 'code': '+377', 'flag':'mc.png'}, {'name': 'Mongolia', 'code': '+976', 'flag':'mn.png'}, {'name': 'Montenegro', 'code': '+382', 'flag':'me.png'}, {'name': 'Montserrat', 'code': '+1', 'flag':'ms.png'}, {'name': 'Morocco and Western Sahara', 'code': '+212', 'flag':'ma.png'}, {'name': 'Mozambique', 'code': '+258', 'flag':'mz.png'}, {'name': 'Myanmar', 'code': '+95', 'flag':'mm.png'}, {'name': 'Namibia', 'code': '+264', 'flag':'na.png'}, {'name': 'Nauru', 'code': '+674', 'flag':'nr.png'}, {'name': 'Nepal', 'code': '+977', 'flag':'np.png'}, {'name': 'Netherlands', 'code': '+31', 'flag':'nl.png'}, {'name': 'New Caledonia', 'code': '+687', 'flag':'nc.png'}, {'name': 'New Zealand', 'code': '+64', 'flag':'nz.png'}, {'name': 'Nicaragua', 'code': '+505', 'flag':'ni.png'}, {'name': 'Niger', 'code': '+227', 'flag':'ne.png'}, {'name': 'Nigeria', 'code': '+234', 'flag':'ng.png'}, {'name': 'Niue', 'code': '+683', 'flag':'nu.png'}, {'name': 'Norfolk Island', 'code': '+672', 'flag':'nf.png'}, {'name': 'Northern Mariana Islands', 'code': '+1', 'flag':'mp.png'}, {'name': 'Norway', 'code': '+47', 'flag':'no.png'}, {'name': 'Oman', 'code': '+968', 'flag':'om.png'}, {'name': 'Pakistan', 'code': '+92', 'flag':'pk.png'}, {'name': 'Palau', 'code': '+680', 'flag':'pw.png'}, {'name': 'Palestinian Territory, Occupied', 'code': '+970', 'flag':'ps.png'}, {'name': 'Panama', 'code': '+507', 'flag':'pa.png'}, {'name': 'Papua New Guinea', 'code': '+675', 'flag':'pg.png'}, {'name': 'Paraguay', 'code': '+595', 'flag':'py.png'}, {'name': 'Peru', 'code': '+51', 'flag':'pe.png'}, {'name': 'Philippines', 'code': '+63', 'flag':'ph.png'}, {'name': 'Pitcairn', 'code': '+870', 'flag':'pn.png'}, {'name': 'Poland', 'code': '+48', 'flag':'pl.png'}, {'name': 'Portugal', 'code': '+351', 'flag':'pt.png'}, {'name': 'Puerto Rico', 'code': '+1', 'flag':'pr.png'}, {'name': 'Qatar', 'code': '+974', 'flag':'qa.png'}, {'name': 'Réunion and Mayotte', 'code': '+262', 'flag':'re.png'}, {'name': 'Romania', 'code': '+40', 'flag':'ro.png'}, {'name': 'Russian Federation', 'code': '+7', 'flag':'ru.png'}, {'name': 'Rwanda', 'code': '+250', 'flag':'rw.png'}, {'name': 'Saint Helena and also Tristan Da Cunha', 'code': '+290', 'flag':'sh.png'}, {'name': 'Saint Kitts and Nevis', 'code': '+1', 'flag':'kn.png'}, {'name': 'Saint Lucia', 'code': '+1', 'flag':'lc.png'}, {'name': 'Saint Pierre and Miquelon', 'code': '+508', 'flag':'pm.png'}, {'name': 'Saint Vincent and the Grenadines', 'code': '+1', 'flag':'vc.png'}, {'name': 'Samoa', 'code': '+685', 'flag':'ws.png'}, {'name': 'San Marino', 'code': '+378', 'flag':'sm.png'}, {'name': 'São Tomé and Principe', 'code': '+239', 'flag':'st.png'}, {'name': 'Saudi Arabia', 'code': '+966', 'flag':'sa.png'}, {'name': 'Senegal', 'code': '+221', 'flag':'sn.png'}, {'name': 'Serbia', 'code': '+381', 'flag':'rs.png'}, {'name': 'Seychelles', 'code': '+248', 'flag':'sc.png'}, {'name': 'Sierra Leone', 'code': '+232', 'flag':'sl.png'}, {'name': 'Singapore', 'code': '+65', 'flag':'sg.png'}, {'name': 'Slovakia', 'code': '+421', 'flag':'sk.png'}, {'name': 'Slovenia', 'code': '+386', 'flag':'si.png'}, {'name': 'Solomon Islands', 'code': '+677', 'flag':'sb.png'}, {'name': 'Somalia', 'code': '+252', 'flag':'so.png'}, {'name': 'Spain', 'code': '+34', 'flag':'es.png'}, {'name': 'Sri Lanka', 'code': '+94', 'flag':'lk.png'}, {'name': 'Sudan', 'code': '+249', 'flag':'sd.png'}, {'name': 'Suriname', 'code': '+597', 'flag':'sr.png'}, {'name': 'Svalbard and Jan Mayen Islands', 'code': '+47', 'flag':'sj.png'}, {'name': 'Sweden', 'code': '+46', 'flag':'se.png'}, {'name': 'Switzerland', 'code': '+41', 'flag':'ch.png'}, {'name': 'Syrian Arab Republic (Syria)', 'code': '+963', 'flag':'sy.png'}, {'name': 'Taiwan, Republic of China', 'code': '+886', 'flag':'tw.png'}, {'name': 'Tajikistan', 'code': '+992', 'flag':'tj.png'}, {'name': 'Tanzania, United Republic of', 'code': '+255', 'flag':'tz.png'}, {'name': 'Thailand', 'code': '+66', 'flag':'th.png'}, {'name': 'Timor-Leste', 'code': '+670', 'flag':'tl.png'}, {'name': 'Togo', 'code': '+228', 'flag':'tg.png'}, {'name': 'Tokelau', 'code': '+690', 'flag':'tk.png'}, {'name': 'Tonga', 'code': '+676', 'flag':'to.png'}, {'name': 'Trinidad and Tobago', 'code': '+1', 'flag':'tt.png'}, {'name': 'Tunisia', 'code': '+216', 'flag':'tn.png'}, {'name': 'Turkey', 'code': '+90', 'flag':'tr.png'}, {'name': 'Turkmenistan', 'code': '+993', 'flag':'tm.png'}, {'name': 'Turks and Caicos Islands', 'code': '+1', 'flag':'tc.png'}, {'name': 'Tuvalu', 'code': '+688', 'flag':'tv.png'}, {'name': 'Uganda', 'code': '+256', 'flag':'ug.png'}, {'name': 'Ukraine', 'code': '+380', 'flag':'ua.png'}, {'name': 'United Arab Emirates', 'code': '+971', 'flag':'ae.png'}, {'name': 'United Kingdom', 'code': '+44', 'flag':'gb.png'}, {'name': 'United States of America', 'code': '+1', 'flag':'us.png'}, {'name': 'Uruguay', 'code': '+598', 'flag':'uy.png'}, {'name': 'Uzbekistan', 'code': '+998', 'flag':'uz.png'}, {'name': 'Vanuatu', 'code': '+678', 'flag':'vu.png'}, {'name': 'Venezuela (Bolivarian Republic of)', 'code': '+58', 'flag':'ve.png'}, {'name': 'Viet Nam', 'code': '+84', 'flag':'vn.png'}, {'name': 'Virgin Islands, British', 'code': '+1', 'flag':'vg.png'}, {'name': 'Virgin Islands, US', 'code': '+1', 'flag':'vi.png'}, {'name': 'Wallis and Futuna Islands', 'code': '+681', 'flag':'wf.png'}, {'name': 'Yemen', 'code': '+967', 'flag':'ye.png'}, {'name': 'Zimbabwe', 'code': '+263', 'flag':'zw.png'}];
	countryChosen: any;
	
	constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewCountryMobilePage');
	}
	
	
	handleSelect(selectedCountry)
	{
		console.log(selectedCountry);
		this.countryChosen = selectedCountry;
		let data = this.countryChosen==null ? {} : { 'selectedCountry': this.countryChosen };
		console.log(data);
		this.viewCtrl.dismiss(data);
	}
	
	dismissModal() {
		let data = { 'selectedCountry': this.countryChosen };
		this.viewCtrl.dismiss(data);
	}

}
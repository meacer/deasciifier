# Kodu Nasıl Kullanabilirim? #

Deasciifier'i kendi web sayfalarınızda kullanabilirsiniz. Bunun için yapmanız gereken, web sayfanızın HTML kodunu değiştirmek. Adım adım şunları yapmanız gerekmekte:

1. Kodların içinde /js klasörü altındaki deasciifier.js ve deasciifier\_handler.js dosyalarını HTML sayfanızın olduğu yere kopyalayın.

2. HTML sayfanız içinde


&lt;script src="deasciifier.js"&gt;



&lt;/script&gt;




&lt;script src="deasciifier\_handler.js"&gt;



&lt;/script&gt;


ile deasciifier'i ve otomatik çeviriciyi yükleyin.

3. `DeasciifyHandler.init()` ile otomatik çeviriciyi başlatın. Bundan sonra istediğiniz HTML elementi için
`DeasciifyHandler.install(element)` şeklinde otomatik çeviriyi etkinleştirebilirsiniz.

Bu kadar!


---


# Ayrıntılar #

`DeasciifyHandler`'daki fonksiyonlar şu şekilde:

**`DeasciifyHandler.init()`** : Otomatik çeviriciyi yükler.

**`DeasciifyHandler.install(html_element, enabled (opsiyonel), callback_function (opsiyonel))`**: html\_element için otomatik çeviriyi etkinleştirir.
**enabled** parametresi false ise çevirici element'e yüklenir ancak aktive edilmez. Bu parametreyi boş bırakabilirsiniz. (Varsayılan değer: true)
**callback\_function** parametresi verilmişse otomatik çeviriden sonra callback\_function fonksiyonu çağrılır. Bu parametreyi boş bırakabilirsiniz.

`DeasciifyHandler.uninstall(html_element)`: Verilen elementten otomatik çeviriyi kaldırır.

`DeasciifyHandler.deasciify(textBox,fullText)`: Verilen elementi deasciify eder. fullText true ise tüm metin çevrilir, aksi halde sadece imlecin üzerinde olduğu kelime ya da seçili kelime çevrilir.

`DeasciifyHandler.setEnabled(element, enabled)`: Verilen element için otomatik çeviriyi aktive/deaktive eder.

`DeasciifyHandler.getEnabled(element)`: Verilen element için otomatik çevirinin aktif olup olmadığını bildirir.


---

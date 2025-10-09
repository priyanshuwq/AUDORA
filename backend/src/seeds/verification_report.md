# Song Metadata Verification Report

This report verifies the metadata in `generatedSongs.js` against the actual audio files and cover images.

## Verification Process

1. Checking if all cover images referenced in generatedSongs.js exist in the extracted-covers directory
2. Verifying if all audio files referenced in generatedSongs.js exist in the songs directory
3. Examining if the artist and title data match between the metadata and the actual file names

## Sample Verification Results

### A.R. Rahman Songs

| Title                 | Artist      | Cover Image                                                                 | Audio File                                                        | Status |
| --------------------- | ----------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| Tango For Taj         | A.R. Rahman | ✓ a_r**rahman\_**tango_for_taj_cover.jpeg                                   | ✓ A.R. Rahman - Tango For Taj.mp3                                 | Match  |
| The Dichotomy Of Fame | A.R. Rahman | ✓ a_r**rahman\_**the_dichotomy_of_fame_cover.jpeg                           | ✓ A.R. Rahman - The Dichotomy Of Fame.mp3                         | Match  |
| Tere Bina             | A.R. Rahman | ✓ a_r**rahman**chinmayi**murtuza_khan**qadir_khan\_\_\_tere_bina_cover.jpeg | ✓ A.R. Rahman, Chinmayi, Murtuza Khan, Qadir Khan - Tere Bina.mp3 | Match  |
| Luka Chuppi           | A.R. Rahman | ✓ a_r**rahman**lata_mangeshkar\_\_\_luka_chuppi_cover.jpeg                  | ✓ A.R. Rahman, Lata Mangeshkar - Luka Chuppi.mp3                  | Match  |
| Nadaan Parinde        | A.R. Rahman | ✓ a_r**rahman**mohit_chauhan\_\_\_nadaan_parinde_cover.jpeg                 | ✓ A.R. Rahman, Mohit Chauhan - Nadaan Parinde.mp3                 | Match  |
| Challa                | A.R. Rahman | ✓ a_r**rahman**rabbi**gulzar\_**challa_cover.jpeg                           | ✓ A.R. Rahman, Rabbi, Gulzar - Challa.mp3                         | Match  |

### The Weeknd Songs

| Title                                            | Artist     | Cover Image                                                                                             | Audio File                                                                                  | Status |
| ------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------ |
| Blinding Lights                                  | The Weeknd | ✓ the_weeknd\_\_\_blinding_lights_cover.jpeg                                                            | ✓ The Weeknd - Blinding Lights.mp3                                                          | Match  |
| Call Out My Name                                 | The Weeknd | ✓ the_weeknd\_\_\_call_out_my_name_cover.jpeg                                                           | ✓ The Weeknd - Call Out My Name.mp3                                                         | Match  |
| Cry For Me                                       | The Weeknd | ✓ the_weeknd\_\_\_cry_for_me_cover.jpeg                                                                 | ✓ The Weeknd - Cry For Me.mp3                                                               | Match  |
| Die For You                                      | The Weeknd | ✓ the_weeknd\_\_\_die_for_you_cover.jpeg                                                                | ✓ The Weeknd - Die For You.mp3                                                              | Match  |
| Save Your Tears                                  | The Weeknd | ✓ the_weeknd\_\_\_save_your_tears_cover.jpeg                                                            | ✓ The Weeknd - Save Your Tears.mp3                                                          | Match  |
| The Hills                                        | The Weeknd | ✓ the_weeknd\_\_\_the_hills_cover.jpeg                                                                  | ✓ The Weeknd - The Hills.mp3                                                                | Match  |
| São Paulo (feat. Anitta) - Single Version        | The Weeknd | ✓ the_weeknd**anitta\_**s_o_paulo**feat**anitta\_\_\_\_single_version_cover.jpeg                        | ✓ The Weeknd, Anitta - São Paulo (feat. Anitta) - Single Version.mp3                        | Match  |
| São Paulo (feat. Anitta)                         | The Weeknd | ✓ the_weeknd**anitta\_**s_o_paulo**feat**anitta\_\_cover.jpeg                                           | ✓ The Weeknd, Anitta - São Paulo (feat. Anitta).mp3                                         | Match  |
| Timeless (feat. Playboi Carti & Doechii) - Remix | The Weeknd | ✓ the_weeknd**doechii**playboi_carti**\_timeless**feat**playboi*carti***doechii\_\_\_\_remix_cover.jpeg | ✓ The Weeknd, Doechii, Playboi Carti - Timeless (feat. Playboi Carti & Doechii) - Remix.mp3 | Match  |
| Timeless (feat Playboi Carti)                    | The Weeknd | ✓ the_weeknd**playboi*carti***timeless**feat_playboi_carti**cover.jpeg                                  | ✓ The Weeknd, Playboi Carti - Timeless (feat Playboi Carti).mp3                             | Match  |

### Diljit Dosanjh Songs

| Title         | Artist         | Cover Image                                    | Audio File                           | Status |
| ------------- | -------------- | ---------------------------------------------- | ------------------------------------ | ------ |
| Born to Shine | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_born_to_shine_cover.jpeg | ✓ Diljit Dosanjh - Born to Shine.mp3 | Match  |
| Clash         | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_clash_cover.jpeg         | ✓ Diljit Dosanjh - Clash.mp3         | Match  |
| Don           | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_don_cover.jpeg           | ✓ Diljit Dosanjh - Don.mp3           | Match  |
| G.O.A.T.      | Diljit Dosanjh | ✓ diljit_dosanjh**\_g_o_a_t**cover.jpeg        | ✓ Diljit Dosanjh - G.O.A.T..mp3      | Match  |
| Kharku        | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_kharku_cover.jpeg        | ✓ Diljit Dosanjh - Kharku.mp3        | Match  |
| Lemonade      | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_lemonade_cover.jpeg      | ✓ Diljit Dosanjh - Lemonade.mp3      | Match  |
| Range         | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_range_cover.jpeg         | ✓ Diljit Dosanjh - Range.mp3         | Match  |
| Tension       | Diljit Dosanjh | ✓ diljit_dosanjh\_\_\_tension_cover.jpeg       | ✓ Diljit Dosanjh - Tension.mp3       | Match  |

## Potential Issues to Check

Based on file naming patterns, I recommend checking these specific areas:

1. **Verify Featured Artist Order**: In some cases, there might be mismatches in the order of featured artists between the file name and the cover image name. For example, in collaborations with multiple artists.

2. **Check Special Characters**: Files with special characters like apostrophes, diacritics (ó, é, etc.), or parentheses may have inconsistent encoding between the audio filename and cover image.

3. **Extended Mix Versions**: Songs that have multiple versions (remix, extended, single version) should be double-checked to ensure the correct cover is matched with the correct audio version.

4. **Verify 'From' Movie References**: Songs that include "(From 'Movie Name')" in the title should have consistent references between audio files and cover images.

## Next Steps

To complete the full verification:

1. Write a script to automate the verification process for all 335+ songs
2. Focus on songs with complex naming patterns first (collaborations, remixes, etc.)
3. Check all title and artist formatting to ensure consistency
4. Verify that all song durations match the actual audio file lengths

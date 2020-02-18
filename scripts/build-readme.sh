#!/bin/bash
README=".README.md"
README_OL_REACT="src/@saeon/ol-react/README.md"
README_ATLAS_CLIENT="src/@saeon/atlas-client/README.md"
README_ATLAS_API="src/@saeon/atlas-API/README.md"

end_section() {
    echo '' >> README.md
    echo '' >> README.md
}

echo Starting build-readme.sh
echo '<!--- This file is automatically generated. Don''t edit! -->' > README.md

cat $README >> README.md
end_section

cat $README_OL_REACT >> README.md
end_section

cat $README_ATLAS_CLIENT >> README.md
end_section

cat $README_ATLAS_API >> README.md
end_section

# Final
echo Completed build-readme.sh